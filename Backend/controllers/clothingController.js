const pool = require("../config/db");
exports.createClothing = async (req, res) => {
  const client = await pool.connect();

  try {
    const ownerId = req.user.id;

    const {
      category_id,
      title,
      description,
      brand,
      size,
      clothing_condition,
      color,
      gender,
      estimated_value,
      city,
      state,
      latitude,
      longitude,
    } = req.body;

    if (!category_id || !title || !size || !clothing_condition) {
      return res.status(400).json({
        success: false,
        message: "Please provide category, title, size and condition",
      });
    }

    await client.query("BEGIN");

    const clothingResult = await client.query(
      `
            INSERT INTO clothing_items
            (
                owner_id,
                category_id,
                title,
                description,
                brand,
                size,
                clothing_condition,
                color,
                gender,
                estimated_value,
                city,
                state,
                latitude,
                longitude
            )
            VALUES
            (
                $1, $2, $3, $4, $5, $6, $7,
                $8, $9, $10, $11, $12, $13, $14
            )
            RETURNING *
            `,
      [
        ownerId,
        Number(category_id),
        title.trim(),
        description || null,
        brand || null,
        size,
        clothing_condition,
        color || null,
        gender || null,
        estimated_value ? Number(estimated_value) : null,
        city || null,
        state || null,
        latitude !== undefined && latitude !== "" ? Number(latitude) : null,
        longitude !== undefined && longitude !== "" ? Number(longitude) : null,
      ],
    );

    const clothing = clothingResult.rows[0];

    // Save uploaded image URLs
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await client.query(
          `
                    INSERT INTO clothing_images
                    (clothing_id, image_url)
                    VALUES ($1, $2)
                    `,
          [clothing.id, file.path],
        );
      }
    }
    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "Clothing listing created successfully",
      clothing,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("CREATE CLOTHING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  } finally {
    client.release();
  }
};
exports.getMyListings = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
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
        ci.latitude,
        ci.longitude,

        ci.status,
        ci.created_at,
        ci.updated_at,

        COALESCE(
          ARRAY_AGG(
            cim.image_url
            ORDER BY cim.id
          ) FILTER (WHERE cim.image_url IS NOT NULL),
          '{}'
        ) AS images

      FROM clothing_items AS ci

      LEFT JOIN categories AS c
        ON ci.category_id = c.id

      LEFT JOIN clothing_images AS cim
        ON ci.id = cim.clothing_id

      WHERE ci.owner_id = $1

      GROUP BY
        ci.id,
        c.name

      ORDER BY ci.created_at DESC
      `,
      [userId],
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      clothing: result.rows,
    });
  } catch (error) {
    console.log("GET MY LISTINGS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
exports.getClothingById = async (req, res) => {
  try {
    const clothingId = req.params.id;

    const result = await pool.query(
      `
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
        ci.latitude,
        ci.longitude,

        ci.status,
        ci.created_at,
        ci.updated_at,

        u.full_name AS owner_name,
        u.rating AS owner_rating,
        u.completed_swaps AS owner_completed_swaps,

        COALESCE(
          ARRAY_AGG(
            cim.image_url
            ORDER BY cim.id
          ) FILTER (WHERE cim.image_url IS NOT NULL),
          '{}'
        ) AS images

      FROM clothing_items AS ci

      LEFT JOIN categories AS c
        ON ci.category_id = c.id

      LEFT JOIN users AS u
        ON ci.owner_id = u.id

      LEFT JOIN clothing_images AS cim
        ON ci.id = cim.clothing_id

      WHERE ci.id = $1

      GROUP BY
        ci.id,
        c.name,
        u.full_name,
        u.rating,
        u.completed_swaps
      `,
      [clothingId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Clothing item not found",
      });
    }

    res.status(200).json({
      success: true,
      clothing: result.rows[0],
    });
  } catch (error) {
    console.log("GET CLOTHING BY ID ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
exports.updateClothing = async (req, res) => {
  const client = await pool.connect();

  try {
    const ownerId = req.user.id;
    const { id } = req.params;

    const {
      category_id,
      title,
      description,
      brand,
      size,
      clothing_condition,
      color,
      gender,
      estimated_value,
      city,
      state,
      latitude,
      longitude,
    } = req.body;

    if (!category_id || !title || !size || !clothing_condition) {
      return res.status(400).json({
        success: false,
        message: "Please provide category, title, size and condition",
      });
    }

    await client.query("BEGIN");

    const result = await client.query(
      `
      UPDATE clothing_items
      SET
        category_id = $1,
        title = $2,
        description = $3,
        brand = $4,
        size = $5,
        clothing_condition = $6,
        color = $7,
        gender = $8,
        estimated_value = $9,
        city = $10,
        state = $11,
        latitude = $12,
        longitude = $13,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $14
        AND owner_id = $15
      RETURNING *
      `,
      [
        Number(category_id),
        title.trim(),
        description || null,
        brand || null,
        size,
        clothing_condition,
        color || null,
        gender || null,
        estimated_value ? Number(estimated_value) : null,
        city || null,
        state || null,
        latitude !== undefined && latitude !== "" ? Number(latitude) : null,
        longitude !== undefined && longitude !== "" ? Number(longitude) : null,
        id,
        ownerId,
      ],
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Clothing item not found or you are not the owner",
      });
    }

    /*
     * Replace images only when the user
     * actually uploaded new images.
     */
    if (req.files && req.files.length > 0) {
      await client.query(
        `
        DELETE FROM clothing_images
        WHERE clothing_id = $1
        `,
        [id],
      );

      for (const file of req.files) {
        await client.query(
          `
          INSERT INTO clothing_images
          (clothing_id, image_url)
          VALUES ($1, $2)
          `,
          [id, file.path],
        );
      }
    }

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Clothing listing updated successfully",
      clothing: result.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("UPDATE CLOTHING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  } finally {
    client.release();
  }
};
exports.deleteClothing = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { id } = req.params;
    const result = await pool.query(
      `DELETE FROM clothing_items
        WHERE id = $1
        AND owner_id = $2
        RETURNING id`,
      [id, ownerId],
    );
    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Clothing item not found or you are not the owner",
      });
    }
    res.status(200).json({
      success: true,
      message: "Clothing listing deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
exports.getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name
             FROM categories
             ORDER BY name ASC`,
    );

    return res.status(200).json({
      success: true,
      categories: result.rows,
    });
  } catch (error) {
    console.log("GET CATEGORIES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch categories",
    });
  }
};
exports.getAllClothings = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
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
        ci.latitude,
        ci.longitude,
        ci.status,
        ci.created_at,

        u.full_name AS owner_name,
        u.rating AS owner_rating,
        u.completed_swaps AS owner_completed_swaps,

        COALESCE(
          ARRAY_AGG(
            cim.image_url
            ORDER BY cim.id
          ) FILTER (WHERE cim.image_url IS NOT NULL),
          '{}'
        ) AS images

      FROM clothing_items ci

      LEFT JOIN categories c
        ON ci.category_id = c.id

      LEFT JOIN users u
        ON ci.owner_id = u.id

      LEFT JOIN clothing_images cim
        ON ci.id = cim.clothing_id

      WHERE ci.status = 'AVAILABLE'
        AND ci.owner_id != $1

      GROUP BY
        ci.id,
        c.name,
        u.full_name,
        u.rating,
        u.completed_swaps

      ORDER BY ci.created_at DESC
      `,
      [userId],
    );
    res.status(200).json({
      success: true,
      count: result.rows.length,
      clothing: result.rows,
    });
  } catch (error) {
    console.log("GET ALL CLOTHINGS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
