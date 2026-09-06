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
    // -----------------------------------------
    // Total users
    // -----------------------------------------

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
