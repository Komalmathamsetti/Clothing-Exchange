const pool = require("../config/db");
const bcrypt = require("bcrypt");
exports.getProfile = async (req, res) => {
  try {
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
      [userId],
    );
    if (user.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      user: user.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, phone, city, state } = req.body;

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
      [full_name, phone, city, state, userId],
    );

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user: updatedUser.rows[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE id=$1", [userId]);
    const isMatch = await bcrypt.compare(oldPassword, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old Password is incorrect",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      `UPDATE users
             SET password=$1
             WHERE id=$2`,
      [hashedPassword, userId],
    );

    res.status(200).json({
      success: true,
      message: "Password Changed Successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    await pool.query(
      `UPDATE users
             SET is_active=false
             WHERE id=$1`,
      [userId],
    );
    res.status(200).json({
      success: true,
      message: "Account Deleted Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
exports.updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile picture is required",
      });
    }

    const profileImage = req.file.path;

    const updatedUser = await pool.query(
      `UPDATE users
             SET profile_image = $1
             WHERE id = $2
             AND is_active = true
             RETURNING id,
                       full_name,
                       email,
                       phone,
                       city,
                       state,
                       role,
                       profile_image`,
      [profileImage, userId],
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      user: updatedUser.rows[0],
    });
  } catch (error) {
    console.error("PROFILE IMAGE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile picture",
    });
  }
};
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Number of active listings
    const listingsResult = await pool.query(
      `SELECT COUNT(*) AS count
       FROM clothing_items
       WHERE owner_id = $1
       AND status = 'AVAILABLE'`,
      [userId],
    );

    // 2. Successful swaps
    const swapsResult = await pool.query(
      `SELECT COUNT(*) AS count
       FROM swap_requests
       WHERE (sender_id = $1 OR reciever_id = $1)
       AND status = 'ACCEPTED'`,
      [userId],
    );

    // 3. Total swap requests involving this user
    const swapRequestsResult = await pool.query(
      `SELECT COUNT(*) AS count
       FROM swap_requests
       WHERE sender_id = $1
          OR reciever_id = $1`,
      [userId],
    );

    // 4. Pending swap requests received by this user
    const pendingSwapsResult = await pool.query(
      `SELECT COUNT(*) AS count
       FROM swap_requests
       WHERE reciever_id = $1
       AND status = 'PENDING'`,
      [userId],
    );
    // 6. Recent swap activity
    const activityResult = await pool.query(
      `SELECT
          sr.id,
          sr.status,
          sr.created_at,
          sr.sender_id,
          sr.reciever_id,

          sender.full_name AS sender_name,
          reciever.full_name AS reciever_name,

          sender_item.title AS sender_item_title,
          reciever_item.title AS reciever_item_title

       FROM swap_requests sr

       JOIN users sender
         ON sender.id = sr.sender_id

       JOIN users reciever
         ON reciever.id = sr.reciever_id

       LEFT JOIN clothing_items sender_item
         ON sender_item.id = sr.sender_item_id

       LEFT JOIN clothing_items reciever_item
         ON reciever_item.id = sr.reciever_item_id

       WHERE sr.sender_id = $1
          OR sr.reciever_id = $1

       ORDER BY sr.created_at DESC
       LIMIT 5`,
      [userId],
    );

    // 7. Profile completion
    const userResult = await pool.query(
      `SELECT
          full_name,
          email,
          phone,
          city,
          state,
          profile_image
       FROM users
       WHERE id = $1
       AND is_active = true`,
      [userId],
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userResult.rows[0];

    let completedFields = 0;
    const totalFields = 6;

    if (user.full_name) completedFields++;
    if (user.email) completedFields++;
    if (user.phone) completedFields++;
    if (user.city) completedFields++;
    if (user.state) completedFields++;
    if (user.profile_image) completedFields++;

    const profileCompletion = Math.round((completedFields / totalFields) * 100);

    res.status(200).json({
      success: true,
      stats: {
        listings: Number(listingsResult.rows[0].count),
        successfulSwaps: Number(swapsResult.rows[0].count),
        swapRequests: Number(swapRequestsResult.rows[0].count),
        pendingSwaps: Number(pendingSwapsResult.rows[0].count),
      },

      recentActivity: activityResult.rows,

      profileCompletion,
    });
  } catch (error) {
    console.error("GET DASHBOARD STATS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};
