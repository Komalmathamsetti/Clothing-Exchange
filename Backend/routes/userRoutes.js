const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
    getProfile,
    updateProfile,
    changePassword,
    deleteAccount
} = require("../controllers/userController");
router.get("/profile", verifyToken, getProfile);
router.put("/update-profile", verifyToken, updateProfile);
router.put("/change-password", verifyToken, changePassword);
router.delete("/delete-account", verifyToken, deleteAccount);
module.exports = router;