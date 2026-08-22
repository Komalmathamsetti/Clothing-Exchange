const pool = require("../config/db");

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // ------------------------------------
    // TOTAL LISTINGS
    // ------------------------------------
    const listingsResult = await pool.query(
      `
      SELECT COUNT(*) AS count
      FROM clothing_items
      WHERE owner_id = $1
      `,
      [userId]
    );

    // ------------------------------------
    // ACTIVE SWAPS
    // ------------------------------------
    const activeSwapsResult = await pool.query(
      `
      SELECT COUNT(*) AS count
      FROM swap_requests
      WHERE
        (
          sender_id = $1
          OR reciever_id = $1
        )
        AND status = 'ACCEPTED'
      `,
      [userId]
    );

    // ------------------------------------
    // COMPLETED SWAPS
    // ------------------------------------
    const completedSwapsResult = await pool.query(
      `
      SELECT COUNT(*) AS count
      FROM swap_requests
      WHERE
        (
          sender_id = $1
          OR reciever_id = $1
        )
        AND status = 'COMPLETED'
      `,
      [userId]
    );

    // ------------------------------------
    // PENDING INCOMING REQUESTS
    // ------------------------------------
    const pendingRequestsResult = await pool.query(
      `
      SELECT COUNT(*) AS count
      FROM swap_requests
      WHERE
        reciever_id = $1
        AND status = 'PENDING'
      `,
      [userId]
    );

    // ------------------------------------
    // RECENT LISTINGS
    // ------------------------------------
    const recentListingsResult = await pool.query(
      `
      SELECT
        ci.id,
        ci.title,
        ci.brand,
        ci.size,
        ci.clothing_condition,
        ci.color,
        ci.gender,
        ci.estimated_value,
        ci.city,
        ci.state,
        ci.status,
        ci.created_at,
        c.name AS category_name
      FROM clothing_items ci
      LEFT JOIN categories c
        ON ci.category_id = c.id
      WHERE ci.owner_id = $1
      ORDER BY ci.created_at DESC
      LIMIT 5
      `,
      [userId]
    );

    // ------------------------------------
    // RECENT SWAP ACTIVITY
    // ------------------------------------
    const recentActivityResult = await pool.query(
      `
      SELECT
        sr.id,
        sr.sender_id,
        sr.reciever_id,
        sr.status,
        sr.message,
        sr.created_at,

        sender.full_name AS sender_name,
        reciever.full_name AS reciever_name,

        sender_item.title AS sender_item_title,
        reciever_item.title AS reciever_item_title

      FROM swap_requests sr

      INNER JOIN users sender
        ON sr.sender_id = sender.id

      INNER JOIN users reciever
        ON sr.reciever_id = reciever.id

      LEFT JOIN clothing_items sender_item
        ON sr.sender_item_id = sender_item.id

      LEFT JOIN clothing_items reciever_item
        ON sr.reciever_item_id = reciever_item.id

      WHERE
        sr.sender_id = $1
        OR sr.reciever_id = $1

      ORDER BY sr.created_at DESC
      LIMIT 5
      `,
      [userId]
    );

    res.status(200).json({
      success: true,

      stats: {
        totalListings: Number(
          listingsResult.rows[0].count
        ),

        activeSwaps: Number(
          activeSwapsResult.rows[0].count
        ),

        completedSwaps: Number(
          completedSwapsResult.rows[0].count
        ),

        pendingRequests: Number(
          pendingRequestsResult.rows[0].count
        ),
      },

      recentListings:
        recentListingsResult.rows,

      recentActivity:
        recentActivityResult.rows,
    });

  } catch (error) {
    console.error(
      "GET DASHBOARD ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load dashboard",
    });
  }
};