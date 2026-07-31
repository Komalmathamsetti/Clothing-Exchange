const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.registerUser = async(req,res)=>{
    try{
      const { full_name,email,password,phone,role } = req.body;
      if(!full_name || !email || !password || !phone || !role){
        return res.status(403).json({
            success:false,
            message:"Please fill all the fields required"
        });
      }
      const existingUser = await pool.query(
        `SELECT * FROM users WHERE email= $1`,[email]
      );
      if(existingUser.rows.length === 0){
        res.status(401).json({
            success:false,
            message:"User already exists"
        });
      }
      const hashedPassword = await bcrypt.hash(password,10);
      const newUser = await pool.query(
        `INSERT INTO users
        (full_name,email,password,role,phone)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING id,full_name,email,role,phone`,[full_name,email,hashedPassword,role,phone]
      );
      res.status(200).json({
        success:true,
        message:"User Registered successfully"
      });
    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
};
exports.loginUser = async(req,res)=>{
    try{
      const { email,password } = req.body;
      if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"Please fill all the required fields"
        });
      }
      const user = await pool.query(
        `SELECT * FROM users WHERE email = $1`,[email]
      );
      if(user.rows.length === 0){
        res.status(404).json({
            success:false,
            message:"User not found"
        });
      }
      const isMatch = await bcrypt.compare(
        password,
        user.rows[0].password
      );
      if(!isMatch){
        return res.status(401).json({
           success:false,
           message:"Invalid Password"
        });
      }
      const token = jwt.sign(
        {
         id:user.rows[0].id,
         role:user.rows[0].role
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"1d"
        }
    );
    res.status(200).json({
        success: true,
        message: "Login Successful",
        token,
        user: {
            id: user.rows[0].id,
            full_name: user.rows[0].full_name,
            email: user.rows[0].email,
            role: user.rows[0].role,
            phone: user.rows[0].phone
        }
    });
    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
};
exports.googleLogin = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }
        // Check if user exists
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        if (existingUser.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Account not found. Please register first."
            });
        }
        const user = existingUser.rows[0];
        // Generate JWT
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );
        res.status(200).json({
            success: true,
            message: "Google Login Successful",
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                profile_image: user.profile_image
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};