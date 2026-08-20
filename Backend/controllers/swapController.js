const pool = require("../config/db");
exports.createSwapRequest = async(req,res)=>{
    try{
      const senderId = req.user.id;
      const {
        reciever_id,
        sender_item_id,
        reciever_item_id,
        message
      } = req.body;
      if(!reciever_id || !sender_item_id || !reciever_item_id){
        return res.status(400).json({
            success:false,
            message:"reciever_id, sender_item_id and reciever_item_id are required"
        });
      }
      if(Number(senderId) === Number(reciever_id)){
        return res.status(400).json({
            success:false,
            message:"You cannot send a swap request to yourself"
        });
      }
      const senderItemResult = await pool.query(
        `SELECT id,owner_id,status 
        FROM clothing_items 
        WHERE id = $1`,[sender_item_id]
      );
      if(senderItemResult.rows.length === 0){
        return res.status(403).json({
          success:false,
          message:"Your offered clothing item cannot be found"
        });
      }
      const senderItem = senderItemResult.rows[0];
      if(Number(senderItem.owner_id) !== Number(senderId)){
        return res.status(403).json({
          success:false,
          message:"You can only offer clothing items that belong to you"
        });
      }
      if (senderItem.status?.toUpperCase() !== "AVAILABLE") {
      return res.status(400).json({
        success: false,
        message:
          "Your offered clothing item is not available",
      });
    }
    const recieverItemResult = await pool.query(
      `SELECT id,owner_id,status
      FROM clothing_items 
      WHERE id = $1`,[reciever_item_id]
    );
    if(recieverItemResult.rows.length === 0){
      return res.status(403).json({
        success:false,
        message:"Requested clothing item was not found"
      });
    }
    const recieverItem = recieverItemResult.rows[0];
    if(Number(recieverItem.owner_id) !== Number(reciever_id)){
      return res.status(403).json({
        success:false,
        message:"The reciever does not own this clothing item"
      });
    }
    if (recieverItem.status?.toUpperCase() !=="AVAILABLE") {
      return res.status(400).json({
        success: false,
        message:
          "The requested clothing item is no longer available",
      });
    }
     if (Number(sender_item_id) === Number(reciever_item_id)) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot offer the same clothing item",
      });
    }
    const duplicateResult = await pool.query(
      `SELECT id
      FROM swap_requests
      WHERE sender_id = $1
        AND reciever_id = $2
        AND sender_item_id = $3
        AND reciever_item_id = $4
        AND status = 'PENDING'`,[ senderId,reciever_id,sender_item_id,reciever_item_id,]
    );
    if (duplicateResult.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "You already have a pending request for this swap",
      });
    }

    // =================================================
    // Create request
    // =================================================

    const result = await pool.query(
      `
      INSERT INTO swap_requests
      (
        sender_id,
        reciever_id,
        sender_item_id,
        reciever_item_id,
        message,
        status
      )
      VALUES
      ($1, $2, $3, $4, $5, 'PENDING')
      RETURNING *
      `,
      [
        senderId,
        reciever_id,
        sender_item_id,
        reciever_item_id,
        message || null,
      ]
    );
    const swapRequest = result.rows[0];
    await pool.query(
      `INSERT INTO chats (swap_request_id)
      VALUES ($1)`,[swapRequest.id]
    );
    res.status(201).json({
      success: true,
      message: "Swap request sent successfully",
      request: result.rows[0],
    });

  } catch (error) {
    console.error(
      "CREATE SWAP REQUEST ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to send swap request",
    });
  }
};


// =====================================================
// GET SENT REQUESTS
// =====================================================

exports.getSentRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        sr.id,
        sr.sender_id,
        sr.reciever_id,
        sr.sender_item_id,
        sr.reciever_item_id,
        sr.message,
        sr.status,
        sr.created_at,

        reciever.full_name AS reciever_name,
        reciever.rating AS reciever_rating,

        sender_item.title AS sender_item_title,
        sender_item.brand AS sender_item_brand,
        sender_item.size AS sender_item_size,
        sender_item.clothing_condition AS sender_item_condition,
        reciever_item.title AS reciever_item_title,
        reciever_item.brand AS reciever_item_brand,
        reciever_item.size AS reciever_item_size,
        reciever_item.clothing_condition AS reciever_item_condition

      FROM swap_requests sr

      LEFT JOIN users reciever
        ON sr.reciever_id = reciever.id

      LEFT JOIN clothing_items sender_item
        ON sr.sender_item_id = sender_item.id

      LEFT JOIN clothing_items reciever_item
        ON sr.reciever_item_id = reciever_item.id

      WHERE sr.sender_id = $1

      ORDER BY sr.created_at DESC
      `,
      [userId]
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      requests: result.rows,
    });

  } catch (error) {
    console.error(
      "GET SENT REQUESTS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch sent requests",
    });
  }
};


// =====================================================
// GET recieveD REQUESTS
// =====================================================

exports.getrecievedRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        sr.id,
        sr.sender_id,
        sr.reciever_id,
        sr.sender_item_id,
        sr.reciever_item_id,
        sr.message,
        sr.status,
        sr.created_at,

        sender.full_name AS sender_name,
        sender.rating AS sender_rating,

        sender_item.title AS sender_item_title,
        sender_item.brand AS sender_item_brand,
        sender_item.size AS sender_item_size,
        sender_item.clothing_condition AS sender_item_condition,

        reciever_item.title AS reciever_item_title,
        reciever_item.brand AS reciever_item_brand,
        reciever_item.size AS reciever_item_size,
        reciever_item.clothing_condition AS reciever_item_condition

      FROM swap_requests sr

      LEFT JOIN users sender
        ON sr.sender_id = sender.id

      LEFT JOIN clothing_items sender_item
        ON sr.sender_item_id = sender_item.id

      LEFT JOIN clothing_items reciever_item
        ON sr.reciever_item_id = reciever_item.id

      WHERE sr.reciever_id = $1

      ORDER BY sr.created_at DESC
      `,
      [userId]
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      requests: result.rows,
    });

  } catch (error) {
    console.error(
      "GET recieveD REQUESTS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch recieved requests",
    });
  }
};


// =====================================================
// GET SINGLE REQUEST
// =====================================================

exports.getSwapRequestById = async (req, res) => {
  try {
    const userId = req.user.id;
    const requestId = req.params.id;

    const result = await pool.query(
      `
      SELECT
        sr.*,

        sender.full_name AS sender_name,
        sender.email AS sender_email,
        sender.rating AS sender_rating,

        reciever.full_name AS reciever_name,
        reciever.email AS reciever_email,
        reciever.rating AS reciever_rating,

        sender_item.title AS sender_item_title,
        sender_item.brand AS sender_item_brand,
        sender_item.size AS sender_item_size,
        sender_item.clothing_condition AS sender_item_condition,
        sender_item.estimated_value AS sender_item_value,

        reciever_item.title AS reciever_item_title,
        reciever_item.brand AS reciever_item_brand,
        reciever_item.size AS reciever_item_size,
        reciever_item.clothing_condition AS reciever_item_condition,
        reciever_item.estimated_value AS reciever_item_value

      FROM swap_requests sr

      LEFT JOIN users sender
        ON sr.sender_id = sender.id

      LEFT JOIN users reciever
        ON sr.reciever_id = reciever.id

      LEFT JOIN clothing_items sender_item
        ON sr.sender_item_id = sender_item.id

      LEFT JOIN clothing_items reciever_item
        ON sr.reciever_item_id = reciever_item.id

      WHERE sr.id = $1
        AND (
          sr.sender_id = $2
          OR sr.reciever_id = $2
        )
      `,
      [requestId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Swap request not found",
      });
    }

    res.status(200).json({
      success: true,
      request: result.rows[0],
    });

  } catch (error) {
    console.error(
      "GET SWAP REQUEST ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch swap request",
    });
  }
};


// =====================================================
// ACCEPT REQUEST
// =====================================================

exports.acceptSwapRequest = async (req, res) => {
  const client = await pool.connect();

  try {
    const recieverId = req.user.id;
    const requestId = req.params.id;

    await client.query("BEGIN");

    // Get request
    const requestResult = await client.query(
      `
      SELECT *
      FROM swap_requests
      WHERE id = $1
      FOR UPDATE
      `,
      [requestId]
    );

    if (requestResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Swap request not found",
      });
    }

    const request = requestResult.rows[0];

    // Only reciever can accept
    if (
      Number(request.reciever_id) !==
      Number(recieverId)
    ) {
      await client.query("ROLLBACK");

      return res.status(403).json({
        success: false,
        message:
          "Only the reciever can accept this request",
      });
    }

    // Must be pending
    if (
      request.status?.toUpperCase() !==
      "PENDING"
    ) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message:
          "This swap request is no longer pending",
      });
    }

    // Check both items
    const itemsResult = await client.query(
      `
      SELECT id, owner_id, status
      FROM clothing_items
      WHERE id IN ($1, $2)
      FOR UPDATE
      `,
      [
        request.sender_item_id,
        request.reciever_item_id,
      ]
    );

    if (itemsResult.rows.length !== 2) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message:
          "One or more clothing items no longer exist",
      });
    }

    const senderItem = itemsResult.rows.find(
      (item) =>
        Number(item.id) ===
        Number(request.sender_item_id)
    );

    const recieverItem = itemsResult.rows.find(
      (item) =>
        Number(item.id) ===
        Number(request.reciever_item_id)
    );

    if (
      senderItem.status?.toUpperCase() !==
        "AVAILABLE" ||
      recieverItem.status?.toUpperCase() !==
        "AVAILABLE"
    ) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message:
          "One or both clothing items are no longer available",
      });
    }

    // Mark both clothing items as exchanged
    await client.query(
      `
      UPDATE clothing_items
      SET status = 'EXCHANGED',
          updated_at = CURRENT_TIMESTAMP
      WHERE id IN ($1, $2)
      `,
      [
        request.sender_item_id,
        request.reciever_item_id,
      ]
    );

    // Accept this request
    const acceptedResult = await client.query(
      `
      UPDATE swap_requests
      SET status = 'ACCEPTED'
      WHERE id = $1
      RETURNING *
      `,
      [requestId]
    );

    // Reject other pending requests involving
    // either clothing item
    await client.query(
      `
      UPDATE swap_requests
      SET status = 'REJECTED'
      WHERE status = 'PENDING'
        AND id <> $1
        AND (
          sender_item_id IN ($2, $3)
          OR reciever_item_id IN ($2, $3)
        )
      `,
      [
        requestId,
        request.sender_item_id,
        request.reciever_item_id,
      ]
    );

    // Update completed swaps for both users
    await client.query(
      `
      UPDATE users
      SET completed_swaps = COALESCE(completed_swaps, 0) + 1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id IN ($1, $2)
      `,
      [
        request.sender_id,
        request.reciever_id,
      ]
    );

    await client.query("COMMIT");

    res.status(200).json({
      success: true,
      message: "Swap request accepted successfully",
      request: acceptedResult.rows[0],
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error(
      "ACCEPT SWAP REQUEST ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to accept swap request",
    });

  } finally {
    client.release();
  }
};


// =====================================================
// REJECT REQUEST
// =====================================================

exports.rejectSwapRequest = async (req, res) => {
  try {
    const recieverId = req.user.id;
    const requestId = req.params.id;

    const result = await pool.query(
      `
      UPDATE swap_requests
      SET status = 'REJECTED'
      WHERE id = $1
        AND reciever_id = $2
        AND status = 'PENDING'
      RETURNING *
      `,
      [requestId, recieverId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Pending swap request not found or you are not authorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Swap request rejected",
      request: result.rows[0],
    });
    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
};