const pool = require("../config/db");

exports.getHomeStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        (
          SELECT COUNT(*)
          FROM users
          WHERE is_active = true
        ) AS users,

        (
          SELECT COUNT(*)
          FROM clothing_items
        ) AS listings,

        (
          SELECT COUNT(*)
          FROM swap_requests
          WHERE status = 'ACCEPTED'
        ) AS successful_swaps,

        (
          SELECT COUNT(DISTINCT city)
          FROM clothing_items
          WHERE city IS NOT NULL
            AND TRIM(city) <> ''
        ) AS cities
    `);

    const stats = result.rows[0];

    res.status(200).json({
      success: true,
      stats: {
        users: Number(stats.users),
        listings: Number(stats.listings),
        successfulSwaps: Number(stats.successful_swaps),
        cities: Number(stats.cities),
      },
    });
  } catch (error) {
    console.error("GET HOME STATS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch home statistics",
    });
  }
};