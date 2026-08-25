const pool = require("../config/db");
exports.getNearbyListings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { city, state } = req.query;
    if (!city) {
      return res.status(403).json({
        success: false,
        message: "City is required",
      });
    }
    let query = `
  SELECT
    ci.id,
    ci.owner_id,
    ci.category_id,
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
    c.name AS category_name,
    u.full_name AS owner_name

  FROM clothing_items AS ci

  LEFT JOIN categories c
    ON ci.category_id = c.id

  INNER JOIN users u
    ON ci.owner_id = u.id

  WHERE ci.city ILIKE $1
    AND ci.owner_id != $2
    AND ci.status = 'AVAILABLE'
`;

    const values = [city, userId];

    if (state) {
      query += ` AND ci.state ILIKE $3`;
      values.push(state);
    }

    query += ` ORDER BY ci.created_at DESC`;
    const result = await pool.query(query, values);
    return res.status(200).json({
      success: true,
      count: result.rows.length,
      listings: result.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
