const pool = require("../config/db");
const bcrypt = require("bcrypt");
exports.getProfile = async(req,res)=>{
    try{
       const userId = req.user.id;
        const user = await pool.query(
            `SELECT id,
                    full_name,
                    email,
                    phone,
                    city,
                    state,
                    role,
                    profile_image
             FROM users
             WHERE id = $1
             AND is_active = true`,
            [userId]
        );
        if (user.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            user: user.rows[0]
        });
    }catch(error){
      console.log(error);
      res.status(500).json({success:false,message: "Internal Server Error"})
    }
};
exports.updateProfile = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            full_name,
            phone,
            city,
            state
        } = req.body;

        const updatedUser = await pool.query(
            `UPDATE users
             SET full_name=$1,
                 phone=$2,
                 city=$3,
                 state=$4
             WHERE id=$5
             RETURNING id,
                       full_name,
                       email,
                       phone,
                       city,
                       state`,
            [
                full_name,
                phone,
                city,
                state,
                userId
            ]
        );

        res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            user: updatedUser.rows[0]
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// =======================
// Change Password
// =======================
exports.changePassword = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            oldPassword,
            newPassword
        } = req.body;

        const user = await pool.query(
            "SELECT * FROM users WHERE id=$1",
            [userId]
        );

        const isMatch = await bcrypt.compare(
            oldPassword,
            user.rows[0].password
        );

        if (!isMatch) {

            return res.status(400).json({
                success: false,
                message: "Old Password is incorrect"
            });

        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        await pool.query(
            `UPDATE users
             SET password=$1
             WHERE id=$2`,
            [
                hashedPassword,
                userId
            ]
        );

        res.status(200).json({
            success: true,
            message: "Password Changed Successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// =======================
// Delete Account
// =======================
exports.deleteAccount = async (req, res) => {

    try {

        const userId = req.user.id;

        await pool.query(
            `UPDATE users
             SET is_active=false
             WHERE id=$1`,
            [userId]
        );
        res.status(200).json({
            success: true,
            message: "Account Deleted Successfully"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};