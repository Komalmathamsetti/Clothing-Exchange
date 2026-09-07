const pool = require("../config/db");
exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT
          id,full_name,email,role,phone,city,state,rating,completed_swaps,created_at
          FROM users
          ORDER BY created_at DESC
        `);
    return res.status(200).json({
      success: true,
      count: result.rows.length,
      users: result.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsersResult = await pool.query(`
            SELECT COUNT(*)::int AS total_users
            FROM users
        `);

    // -----------------------------------------
    // Users registered this month
    // -----------------------------------------

    const currentMonthUsersResult = await pool.query(`
            SELECT COUNT(*)::int AS current_month_users
            FROM users
            WHERE created_at >= date_trunc('month', CURRENT_DATE)
        `);

    // -----------------------------------------
    // Users registered previous month
    // -----------------------------------------

    const previousMonthUsersResult = await pool.query(`
            SELECT COUNT(*)::int AS previous_month_users
            FROM users
            WHERE created_at >= date_trunc(
                'month',
                CURRENT_DATE - INTERVAL '1 month'
            )
            AND created_at < date_trunc(
                'month',
                CURRENT_DATE
            )
        `);

    // -----------------------------------------
    // Active clothing listings
    // -----------------------------------------

    const activeListingsResult = await pool.query(`
            SELECT COUNT(*)::int AS active_listings
            FROM clothing_items
            WHERE status = 'AVAILABLE'
        `);

    // -----------------------------------------
    // Listings created this month
    // -----------------------------------------

    const currentMonthListingsResult = await pool.query(`
            SELECT COUNT(*)::int AS current_month_listings
            FROM clothing_items
            WHERE created_at >= date_trunc('month', CURRENT_DATE)
        `);

    // -----------------------------------------
    // Completed swaps
    // -----------------------------------------

    const completedSwapsResult = await pool.query(`
            SELECT COUNT(*)::int AS completed_swaps
            FROM swap_requests
            WHERE status = 'ACCEPTED'
        `);

    // -----------------------------------------
    // Swaps this month
    // -----------------------------------------

    const currentMonthSwapsResult = await pool.query(`
            SELECT COUNT(*)::int AS current_month_swaps
            FROM swap_requests
            WHERE status = 'ACCEPTED'
            AND created_at >= date_trunc('month', CURRENT_DATE)
        `);

    // -----------------------------------------
    // Pending swap requests
    // -----------------------------------------

    const pendingSwapsResult = await pool.query(`
            SELECT COUNT(*)::int AS pending_swaps
            FROM swap_requests
            WHERE status = 'PENDING'
        `);

    // -----------------------------------------
    // Swap activity - last 7 days
    // -----------------------------------------

    const swapActivityResult = await pool.query(`
            SELECT
                DATE(created_at) AS date,
                COUNT(*)::int AS count
            FROM swap_requests
            WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at)
        `);

    // -----------------------------------------
    // Recent users
    // -----------------------------------------

    const recentUsersResult = await pool.query(`
            SELECT
                id,
                full_name,
                email,
                city,
                state,
                role,
                created_at
            FROM users
            ORDER BY created_at DESC
            LIMIT 5
        `);

    // -----------------------------------------
    // Recent swap activity
    // -----------------------------------------

    const recentSwapsResult = await pool.query(`
            SELECT
                sr.id,
                sr.status,
                sr.created_at,

                sender.full_name AS sender_name,
                receiver.full_name AS receiver_name,

                sender_item.title AS sender_item_title,
                receiver_item.title AS receiver_item_title

            FROM swap_requests sr

            LEFT JOIN users sender
                ON sr.sender_id = sender.id

            LEFT JOIN users receiver
                ON sr.reciever_id = receiver.id

            LEFT JOIN clothing_items sender_item
                ON sr.sender_item_id = sender_item.id

            LEFT JOIN clothing_items receiver_item
                ON sr.reciever_item_id = receiver_item.id

            ORDER BY sr.created_at DESC

            LIMIT 5
        `);

    // -----------------------------------------
    // Calculate user growth
    // -----------------------------------------

    const currentMonthUsers =
      currentMonthUsersResult.rows[0].current_month_users;

    const previousMonthUsers =
      previousMonthUsersResult.rows[0].previous_month_users;

    let userGrowth = 0;

    if (previousMonthUsers > 0) {
      userGrowth =
        ((currentMonthUsers - previousMonthUsers) / previousMonthUsers) * 100;
    } else if (currentMonthUsers > 0) {
      userGrowth = 100;
    }

    // -----------------------------------------
    // Calculate listing growth
    // -----------------------------------------

    const currentMonthListings =
      currentMonthListingsResult.rows[0].current_month_listings;

    const activeListings = activeListingsResult.rows[0].active_listings;

    let listingGrowth = 0;

    if (activeListings > 0) {
      listingGrowth = (currentMonthListings / activeListings) * 100;
    }

    // -----------------------------------------
    // Build response
    // -----------------------------------------

    return res.status(200).json({
      success: true,

      statistics: {
        totalUsers: totalUsersResult.rows[0].total_users,

        activeListings,

        completedSwaps: completedSwapsResult.rows[0].completed_swaps,

        pendingSwaps: pendingSwapsResult.rows[0].pending_swaps,

        pendingDisputes: 0,

        userGrowth: Number(userGrowth.toFixed(1)),

        listingGrowth: Number(listingGrowth.toFixed(1)),

        currentMonthSwaps: currentMonthSwapsResult.rows[0].current_month_swaps,
      },

      swapActivity: swapActivityResult.rows,

      recentUsers: recentUsersResult.rows,

      recentSwaps: recentSwapsResult.rows,
    });
  } catch (error) {
    console.log("ADMIN DASHBOARD ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to load admin dashboard",
    });
  }
};
exports.getAllListings = async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT
                ci.id,
                ci.owner_id,
                ci.category_id,
                c.name AS category,
                ci.title,
                ci.description,
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
                u.full_name AS owner_name,
                u.email AS owner_email,

                COALESCE(
                    ARRAY_AGG(
                        cim.image_url
                        ORDER BY cim.id
                    ) FILTER (
                        WHERE cim.image_url IS NOT NULL
                    ),
                    '{}'
                ) AS images

            FROM clothing_items ci

            LEFT JOIN categories c
                ON ci.category_id = c.id

            LEFT JOIN users u
                ON ci.owner_id = u.id

            LEFT JOIN clothing_images cim
                ON ci.id = cim.clothing_id

            GROUP BY
                ci.id,
                c.name,
                u.full_name,
                u.email

            ORDER BY ci.created_at DESC
        `);

    return res.status(200).json({
      success: true,

      count: result.rows.length,

      listings: result.rows,
    });
  } catch (error) {
    console.log("ADMIN GET LISTINGS ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to load listings",
    });
  }
};
// ==========================================
// GET ALL SWAPS
// ==========================================

exports.getAllSwaps = async (req, res) => {
  try {
    const result = await pool.query(`
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
                sender.email AS sender_email,

                receiver.full_name AS receiver_name,
                receiver.email AS receiver_email,

                sender_item.title AS sender_item_title,
                sender_item.estimated_value AS sender_item_value,

                receiver_item.title AS receiver_item_title,
                receiver_item.estimated_value AS receiver_item_value

            FROM swap_requests sr

            LEFT JOIN users sender
                ON sr.sender_id = sender.id

            LEFT JOIN users receiver
                ON sr.reciever_id = receiver.id

            LEFT JOIN clothing_items sender_item
                ON sr.sender_item_id = sender_item.id

            LEFT JOIN clothing_items receiver_item
                ON sr.reciever_item_id = receiver_item.id

            ORDER BY sr.created_at DESC
        `);

    return res.status(200).json({
      success: true,

      count: result.rows.length,

      swaps: result.rows,
    });
  } catch (error) {
    console.log("ADMIN GET SWAPS ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to load swaps",
    });
  }
};
