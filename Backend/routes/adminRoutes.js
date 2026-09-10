const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getUsers,
  getUserById,
  updateUserStatus,
  getDashboardStats,
  getAllListings,
  getAllSwaps,
  removeListing,
  getAnalytics
} = require("../controllers/adminController");
router.get("/test", verifyToken, adminMiddleware, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Admin access granted",
  });
});
router.get("/users", verifyToken, adminMiddleware, getUsers);
router.get("/users/:id", verifyToken, adminMiddleware, getUserById);
router.patch("/users/:id/status",verifyToken,adminMiddleware,updateUserStatus,);
router.get("/dashboard", verifyToken, adminMiddleware, getDashboardStats);
router.get("/listings", verifyToken, adminMiddleware, getAllListings);
router.get("/swaps", verifyToken, adminMiddleware, getAllSwaps);
router.patch("listings/:id/remove",verifyToken,adminMiddleware,removeListing);
router.get("/analytics",verifyToken,adminMiddleware,getAnalytics);
module.exports = router;
