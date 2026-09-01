const pool = require("../config/db");

exports.getNearbyListings = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      latitude,
      longitude,
      city,
      state
    } = req.query;

    // ------------------------------------
    // GPS BASED SEARCH
    // ------------------------------------
    if (latitude && longitude) {
      const userLatitude = Number(latitude);
      const userLongitude = Number(longitude);

      if (
        Number.isNaN(userLatitude) ||
        Number.isNaN(userLongitude)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid latitude or longitude"
        });
      }

      const query = `
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
          ci.latitude,
          ci.longitude,
          ci.status,
          ci.created_at,

          c.name AS category_name,
          u.full_name AS owner_name,

          (
            6371 * acos(
              LEAST(
                1,
                GREATEST(
                  -1,
                  cos(radians($1))
                  * cos(radians(ci.latitude))
                  * cos(radians(ci.longitude) - radians($2))
                  + sin(radians($1))
                  * sin(radians(ci.latitude))
                )
              )
            )
          ) AS distance_km

        FROM clothing_items AS ci

        LEFT JOIN categories AS c
          ON ci.category_id = c.id

        INNER JOIN users AS u
          ON ci.owner_id = u.id

        WHERE ci.owner_id != $3
          AND ci.status = 'AVAILABLE'
          AND ci.latitude IS NOT NULL
          AND ci.longitude IS NOT NULL

        AND (
          6371 * acos(
            LEAST(
              1,
              GREATEST(
                -1,
                cos(radians($1))
                * cos(radians(ci.latitude))
                * cos(radians(ci.longitude) - radians($2))
                + sin(radians($1))
                * sin(radians(ci.latitude))
              )
            )
          )
        ) <= 30

        ORDER BY distance_km ASC
      `;

      const result = await pool.query(query, [
        userLatitude,
        userLongitude,
        userId
      ]);

      return res.status(200).json({
        success: true,
        count: result.rows.length,
        radius_km: 30,
        listings: result.rows
      });
    }

    // ------------------------------------
    // OLD CITY/STATE SEARCH
    // ------------------------------------

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City or location coordinates are required"
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
        ci.latitude,
        ci.longitude,
        ci.status,
        ci.created_at,

        c.name AS category_name,
        u.full_name AS owner_name

      FROM clothing_items AS ci

      LEFT JOIN categories AS c
        ON ci.category_id = c.id

      INNER JOIN users AS u
        ON ci.owner_id = u.id

      WHERE ci.city ILIKE $1
        AND ci.owner_id != $2
        AND ci.status = 'AVAILABLE'
    `;

    const values = [`%${city}%`, userId];

    if (state) {
      query += ` AND ci.state ILIKE $3`;
      values.push(`%${state}%`);
    }

    query += ` ORDER BY ci.created_at DESC`;

    const result = await pool.query(
      query,
      values
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      listings: result.rows
    });

  } catch (error) {
    console.error(
      "GET NEARBY LISTINGS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};