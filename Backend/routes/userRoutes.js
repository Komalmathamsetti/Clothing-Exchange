const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
    getProfile,
    updateProfile,
    changePassword,
    deleteAccount,
    updateProfilePicture,
    getDashboardStats
} = require("../controllers/userController");
const profileUpload = require("../middleware/profileUpload");
router.get("/profile", verifyToken, getProfile);
router.put("/update-profile", verifyToken, updateProfile);
router.put("/profile-picture",verifyToken,profileUpload.single("profile_image"),updateProfilePicture);
router.get("/dashboard",verifyToken,getDashboardStats);
router.put("/change-password", verifyToken, changePassword);
router.delete("/delete-account", verifyToken, deleteAccount);
module.exports = router;