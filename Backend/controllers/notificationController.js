const pool = require("../config/db");

// =====================================================
// GET MY NOTIFICATIONS
// =====================================================

exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        id,
        type,
        title,
        message,
        reference_id,
        reference_type,
        is_read,
        created_at
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.status(200).json({
      success: true,
      notifications: result.rows,
    });
  } catch (error) {
    console.error("GET NOTIFICATIONS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};


// =====================================================
// GET UNREAD NOTIFICATION COUNT
// =====================================================

exports.getUnreadNotificationCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT COUNT(*) AS count
      FROM notifications
      WHERE user_id = $1
      AND is_read = false
      `,
      [userId]
    );

    res.status(200).json({
      success: true,
      count: Number(result.rows[0].count),
    });
  } catch (error) {
    console.error(
      "GET UNREAD NOTIFICATION COUNT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch unread notification count",
    });
  }
};


// =====================================================
// MARK ONE NOTIFICATION AS READ
// =====================================================

exports.markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const result = await pool.query(
      `
      UPDATE notifications
      SET is_read = true
      WHERE id = $1
      AND user_id = $2
      RETURNING *
      `,
      [notificationId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification: result.rows[0],
    });
  } catch (error) {
    console.error(
      "MARK NOTIFICATION READ ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
};


// =====================================================
// MARK ALL NOTIFICATIONS AS READ
// =====================================================

exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.query(
      `
      UPDATE notifications
      SET is_read = true
      WHERE user_id = $1
      AND is_read = false
      `,
      [userId]
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error(
      "MARK ALL NOTIFICATIONS READ ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
    });
  }
};


// =====================================================
// DELETE ONE NOTIFICATION
// =====================================================

exports.deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const result = await pool.query(
      `
      DELETE FROM notifications
      WHERE id = $1
      AND user_id = $2
      RETURNING id
      `,
      [notificationId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE NOTIFICATION ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete notification",
    });
  }
};