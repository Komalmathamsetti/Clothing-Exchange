const express = require("express");

const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");

const {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} = require("../controllers/notificationController");


// Get all notifications
router.get(
  "/",
  verifyToken,
  getMyNotifications
);


// Get unread count
router.get(
  "/unread-count",
  verifyToken,
  getUnreadNotificationCount
);


// Mark one notification as read
router.put(
  "/:id/read",
  verifyToken,
  markNotificationAsRead
);


// Mark all notifications as read
router.put(
  "/read-all",
  verifyToken,
  markAllNotificationsAsRead
);


// Delete one notification
router.delete(
  "/:id",
  verifyToken,
  deleteNotification
);


module.exports = router;