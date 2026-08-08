const pool = require("../config/db");
exports.createClothing = async(req,res)=>{
    try{
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
        state
      } = req.body;
      if(!category_id || !title || !size || !clothing_condition){
        return res.status(400).json({
            success:false,
            message:"Please provide category,title,size and condition"
        });
      }
      const result = await pool.query(
        `INSERT INTO clothing_items
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
           state
        ) VALUES 
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        RETURNING *`,
        [
            ownerId,
            category_id,
            title,
            description || null,
            brand || null,
            size,
            clothing_condition,
            color || null,
            gender || null,
            estimated_value || null,
            city || null,
            state || null
        ]
      );
      res.status(201).json({
        success:true,
        message:"Clothing listed successfully",
        clothing:result.rows[0]
      });
    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
};
exports.getMyListings = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const result = await pool.query(
            `SELECT
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
                ci.updated_at,
                c.name AS category_name
             FROM clothing_items AS ci
             LEFT JOIN categories AS c
                ON ci.category_id = c.id
             WHERE ci.owner_id = $1
             ORDER BY ci.created_at DESC`,
            [ownerId]
        );
        return res.status(200).json({
            success: true,
            count: result.rows.length,
            listings: result.rows
        });
    } catch (error) {
        console.log("GET MY LISTINGS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.getClothingById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT
                ci.*,
                c.name AS category_name,
                u.full_name AS owner_name
             FROM clothing_items ci
             LEFT JOIN categories c
             ON ci.category_id = c.id
             LEFT JOIN users u
             ON ci.owner_id = u.id
             WHERE ci.id = $1`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Clothing item not found"
            });
        }
        res.status(200).json({
            success: true,
            clothing: result.rows[0]
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.updateClothing = async (req, res) => {
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
            state
        } = req.body;

        const result = await pool.query(
            `UPDATE clothing_items
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
                updated_at = CURRENT_TIMESTAMP
             WHERE id = $12
             AND owner_id = $13
             RETURNING *`,
            [
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
                id,
                ownerId
            ]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Clothing item not found or you are not the owner"
            });
        }
        res.status(200).json({
            success: true,
            message: "Clothing listing updated successfully",
            clothing: result.rows[0]
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.deleteClothing = async(req,res)=>{
    try{
      const ownerId = req.user.id;
      const { id } = req.params;
      const result = await pool.query(
        `DELETE FROM clothing_items
        WHERE id = $1
        AND owner_id = $2
        RETURNING id`,[id,ownerId]
      );
      if(result.rows.length === 0){
        return res.status(400).json({
            success:false,
            message:"Clothing item not found or you are not the owner"
        });
      }
      res.status(200).json({
            success: true,
            message: "Clothing listing deleted successfully"
        });
    }catch(error){
       console.log(error);
       res.status(500).json({
        success:false,
        message:"Server Error"
       });
    }
};
exports.getCategories = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name
             FROM categories
             ORDER BY name ASC`
        );

        return res.status(200).json({
            success: true,
            categories: result.rows
        });

    } catch (error) {
        console.log("GET CATEGORIES ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch categories"
        });
    }
};
