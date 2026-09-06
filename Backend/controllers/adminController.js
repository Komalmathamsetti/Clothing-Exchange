const pool = require("../config/db");
exports.getUsers = async(req,res)=>{
    try{
      const result = await pool.query(`
        SELECT
          id,full_name,email,role,phone,city,state,rating,completed_swaps,created_at
          FROM users
          ORDER BY created_at DESC
        `
      );
      return res.status(200).json({
        success:true,
        count:result.rows.length,
        users:result.rows
      });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
};