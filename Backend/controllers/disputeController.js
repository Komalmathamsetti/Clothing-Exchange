const pool = require("../config/db");

/*
|--------------------------------------------------------------------------
| CREATE DISPUTE
|--------------------------------------------------------------------------
| A swap participant can raise a dispute against the other participant.
*/
exports.createDispute = async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.id;

    const { swap_request_id, against_user, clothing_id, subject, description } =
      req.body;

    // ---------------------------------------------------------
    // 1. Validate required fields
    // ---------------------------------------------------------
    if (!swap_request_id || !against_user || !subject || !description) {
      return res.status(400).json({
        success: false,
        message: "Swap, opposite user, subject and description are required",
      });
    }

    // ---------------------------------------------------------
    // 2. User cannot complain against themselves
    // ---------------------------------------------------------
    if (Number(userId) === Number(against_user)) {
      return res.status(400).json({
        success: false,
        message: "You cannot raise a dispute against yourself",
      });
    }

    await client.query("BEGIN");

    // ---------------------------------------------------------
    // 3. Get swap request
    // ---------------------------------------------------------
    const swapResult = await client.query(
      `
            SELECT
                id,
                sender_id,
                reciever_id,
                sender_item_id,
                reciever_item_id,
                status
            FROM swap_requests
            WHERE id = $1
            FOR UPDATE
            `,
      [swap_request_id],
    );

    if (swapResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Swap request not found",
      });
    }

    const swap = swapResult.rows[0];

    // ---------------------------------------------------------
    // 4. Only participants of the swap can raise a dispute
    // ---------------------------------------------------------
    const isParticipant =
      Number(swap.sender_id) === Number(userId) ||
      Number(swap.reciever_id) === Number(userId);

    if (!isParticipant) {
      await client.query("ROLLBACK");

      return res.status(403).json({
        success: false,
        message: "You are not a participant in this swap",
      });
    }

    // ---------------------------------------------------------
    // 5. against_user must be the opposite swap participant
    // ---------------------------------------------------------
    const isAgainstParticipant =
      Number(swap.sender_id) === Number(against_user) ||
      Number(swap.reciever_id) === Number(against_user);

    if (!isAgainstParticipant) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "The reported user is not a participant in this swap",
      });
    }

    // ---------------------------------------------------------
    // 6. Only completed swaps can be disputed
    // ---------------------------------------------------------
    if (swap.status !== "ACCEPTED") {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Only completed swaps can be disputed",
      });
    }

    // ---------------------------------------------------------
    // 7. If clothing_id is provided, make sure it belongs
    //    to this swap
    // ---------------------------------------------------------
    if (clothing_id) {
      const validClothing =
        Number(clothing_id) === Number(swap.sender_item_id) ||
        Number(clothing_id) === Number(swap.reciever_item_id);

      if (!validClothing) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          success: false,
          message: "The clothing item does not belong to this swap",
        });
      }
    }

    // ---------------------------------------------------------
    // 8. Prevent multiple active disputes for same swap
    // ---------------------------------------------------------
    const existingDispute = await client.query(
      `
            SELECT id
            FROM disputes
            WHERE swap_request_id = $1
              AND status IN ('OPEN', 'UNDER_REVIEW')
            `,
      [swap_request_id],
    );

    if (existingDispute.rows.length > 0) {
      await client.query("ROLLBACK");

      return res.status(409).json({
        success: false,
        message: "An active dispute already exists for this swap",
      });
    }

    // ---------------------------------------------------------
    // 9. Create dispute
    // ---------------------------------------------------------
    const disputeResult = await client.query(
      `
            INSERT INTO disputes
            (
                swap_request_id,
                raised_by,
                against_user,
                clothing_id,
                subject,
                description,
                status
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                'OPEN'
            )
            RETURNING *
            `,
      [
        swap_request_id,
        userId,
        against_user,
        clothing_id || null,
        subject.trim(),
        description.trim(),
      ],
    );

    const dispute = disputeResult.rows[0];

    // ---------------------------------------------------------
    // 10. Add original complaint as first message
    // ---------------------------------------------------------
    const messageResult = await client.query(
      `
            INSERT INTO dispute_messages
            (
                dispute_id,
                sender_id,
                message,
                sender_role
            )
            VALUES
            (
                $1,
                $2,
                $3,
                'USER'
            )
            RETURNING *
            `,
      [dispute.id, userId, description.trim()],
    );

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "Dispute created successfully",
      dispute,
      firstMessage: messageResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("CREATE DISPUTE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create dispute",
    });
  } finally {
    client.release();
  }
};

/*
|--------------------------------------------------------------------------
| GET MY DISPUTES
|--------------------------------------------------------------------------
| Returns disputes where the logged-in user is either:
| - the person who raised the dispute
| - the person the dispute was raised against
*/
exports.getMyDisputes = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
            SELECT
                d.id,
                d.swap_request_id,
                d.raised_by,
                d.against_user,
                d.clothing_id,
                d.subject,
                d.description,
                d.status,
                d.created_at,
                d.updated_at,

                raised.full_name AS raised_by_name,
                against.full_name AS against_user_name,

                (
                    SELECT COUNT(*)
                    FROM dispute_messages dm
                    WHERE dm.dispute_id = d.id
                ) AS message_count,

                (
                    SELECT dm.message
                    FROM dispute_messages dm
                    WHERE dm.dispute_id = d.id
                    ORDER BY dm.created_at DESC
                    LIMIT 1
                ) AS latest_message,

                (
                    SELECT dm.created_at
                    FROM dispute_messages dm
                    WHERE dm.dispute_id = d.id
                    ORDER BY dm.created_at DESC
                    LIMIT 1
                ) AS latest_message_at

            FROM disputes d

            JOIN users raised
                ON d.raised_by = raised.id

            JOIN users against
                ON d.against_user = against.id

            WHERE d.raised_by = $1
               OR d.against_user = $1

            ORDER BY
                COALESCE(
                    (
                        SELECT dm.created_at
                        FROM dispute_messages dm
                        WHERE dm.dispute_id = d.id
                        ORDER BY dm.created_at DESC
                        LIMIT 1
                    ),
                    d.created_at
                ) DESC
            `,
      [userId],
    );

    return res.status(200).json({
      success: true,
      disputes: result.rows,
    });
  } catch (error) {
    console.error("GET MY DISPUTES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch disputes",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET DISPUTE BY ID
|--------------------------------------------------------------------------
| Returns the dispute and its complete conversation.
*/
exports.getDisputeById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // ---------------------------------------------------------
    // 1. Get dispute
    // ---------------------------------------------------------
    const disputeResult = await pool.query(
      `
            SELECT
                d.id,
                d.swap_request_id,
                d.raised_by,
                d.against_user,
                d.clothing_id,
                d.subject,
                d.description,
                d.status,
                d.created_at,
                d.updated_at,

                raised.full_name AS raised_by_name,
                raised.email AS raised_by_email,

                against.full_name AS against_user_name,
                against.email AS against_user_email

            FROM disputes d

            JOIN users raised
                ON d.raised_by = raised.id

            JOIN users against
                ON d.against_user = against.id

            WHERE d.id = $1
            `,
      [id],
    );

    if (disputeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Dispute not found",
      });
    }

    const dispute = disputeResult.rows[0];

    // ---------------------------------------------------------
    // 2. Authorization
    // ---------------------------------------------------------
    const isParticipant =
      Number(dispute.raised_by) === Number(userId) ||
      Number(dispute.against_user) === Number(userId);

    const isAdmin = req.user.role === "ADMIN";

    if (!isParticipant && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this dispute",
      });
    }

    // ---------------------------------------------------------
    // 3. Get all messages
    // ---------------------------------------------------------
    const messagesResult = await pool.query(
      `
            SELECT
                dm.id,
                dm.dispute_id,
                dm.sender_id,
                dm.message,
                dm.sender_role,
                dm.created_at,

                u.full_name AS sender_name,
                u.email AS sender_email

            FROM dispute_messages dm

            JOIN users u
                ON dm.sender_id = u.id

            WHERE dm.dispute_id = $1

            ORDER BY dm.created_at ASC
            `,
      [id],
    );

    return res.status(200).json({
      success: true,
      dispute,
      messages: messagesResult.rows,
    });
  } catch (error) {
    console.error("GET DISPUTE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dispute",
    });
  }
};

/*
|--------------------------------------------------------------------------
| ADD DISPUTE MESSAGE
|--------------------------------------------------------------------------
| Used by:
| - Swapper A
| - Swapper B
| - Admin
|
| Everyone replies in the SAME conversation.
*/
exports.addDisputeMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { message } = req.body;

    // ---------------------------------------------------------
    // 1. Validate message
    // ---------------------------------------------------------
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // ---------------------------------------------------------
    // 2. Get dispute
    // ---------------------------------------------------------
    const disputeResult = await pool.query(
      `
            SELECT
                id,
                raised_by,
                against_user,
                status
            FROM disputes
            WHERE id = $1
            `,
      [id],
    );

    if (disputeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Dispute not found",
      });
    }

    const dispute = disputeResult.rows[0];

    // ---------------------------------------------------------
    // 3. Check authorization
    // ---------------------------------------------------------
    const isParticipant =
      Number(dispute.raised_by) === Number(userId) ||
      Number(dispute.against_user) === Number(userId);

    const isAdmin = req.user.role === "ADMIN";

    if (!isParticipant && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to reply to this dispute",
      });
    }

    // ---------------------------------------------------------
    // 4. Closed disputes cannot receive messages
    // ---------------------------------------------------------
    if (dispute.status === "CLOSED") {
      return res.status(400).json({
        success: false,
        message: "This dispute is closed",
      });
    }

    // ---------------------------------------------------------
    // 5. Determine sender role
    // ---------------------------------------------------------
    const senderRole = isAdmin ? "ADMIN" : "USER";

    // ---------------------------------------------------------
    // 6. Insert message
    // ---------------------------------------------------------
    const result = await pool.query(
      `
            INSERT INTO dispute_messages
            (
                dispute_id,
                sender_id,
                message,
                sender_role
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4
            )
            RETURNING
                id,
                dispute_id,
                sender_id,
                message,
                sender_role,
                created_at
            `,
      [id, userId, message.trim(), senderRole],
    );

    // ---------------------------------------------------------
    // 7. Update dispute timestamp
    // ---------------------------------------------------------
    await pool.query(
      `
            UPDATE disputes
            SET updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            `,
      [id],
    );

    // ---------------------------------------------------------
    // 8. If admin replies, move dispute into review
    // ---------------------------------------------------------
    if (isAdmin && dispute.status === "OPEN") {
      await pool.query(
        `
                UPDATE disputes
                SET
                    status = 'UNDER_REVIEW',
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $1
                `,
        [id],
      );
    }

    // ---------------------------------------------------------
    // 9. Return sender information
    // ---------------------------------------------------------
    const messageWithSender = await pool.query(
      `
            SELECT
                dm.id,
                dm.dispute_id,
                dm.sender_id,
                dm.message,
                dm.sender_role,
                dm.created_at,
                u.full_name AS sender_name

            FROM dispute_messages dm

            JOIN users u
                ON dm.sender_id = u.id

            WHERE dm.id = $1
            `,
      [result.rows[0].id],
    );

    return res.status(201).json({
      success: true,
      message: "Reply added successfully",
      disputeMessage: messageWithSender.rows[0],
    });
  } catch (error) {
    console.error("ADD DISPUTE MESSAGE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add reply",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET ALL DISPUTES - ADMIN
|--------------------------------------------------------------------------
*/
exports.getAllDisputes = async (req, res) => {
  try {
    const result = await pool.query(
      `
            SELECT
                d.id,
                d.swap_request_id,
                d.raised_by,
                d.against_user,
                d.clothing_id,
                d.subject,
                d.description,
                d.status,
                d.created_at,
                d.updated_at,

                raised.full_name AS raised_by_name,
                raised.email AS raised_by_email,

                against.full_name AS against_user_name,
                against.email AS against_user_email,

                (
                    SELECT COUNT(*)
                    FROM dispute_messages dm
                    WHERE dm.dispute_id = d.id
                ) AS message_count,

                (
                    SELECT dm.message
                    FROM dispute_messages dm
                    WHERE dm.dispute_id = d.id
                    ORDER BY dm.created_at DESC
                    LIMIT 1
                ) AS latest_message

            FROM disputes d

            JOIN users raised
                ON d.raised_by = raised.id

            JOIN users against
                ON d.against_user = against.id

            ORDER BY d.created_at DESC
            `,
    );

    return res.status(200).json({
      success: true,
      disputes: result.rows,
    });
  } catch (error) {
    console.error("GET ALL DISPUTES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch disputes",
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE DISPUTE STATUS - ADMIN
|--------------------------------------------------------------------------
*/
exports.updateDisputeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["OPEN", "UNDER_REVIEW", "RESOLVED", "CLOSED"];

    // ---------------------------------------------------------
    // 1. Validate status
    // ---------------------------------------------------------
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid dispute status",
      });
    }

    // ---------------------------------------------------------
    // 2. Update status
    // ---------------------------------------------------------
    const result = await pool.query(
      `
            UPDATE disputes
            SET
                status = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
            `,
      [status, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Dispute not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Dispute status updated successfully",
      dispute: result.rows[0],
    });
  } catch (error) {
    console.error("UPDATE DISPUTE STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update dispute status",
    });
  }
};
