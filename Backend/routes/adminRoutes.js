const express = require("express");

const router = express.Router();
const {verifyToken} = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { getUsers } = require("../controllers/adminController");
router.get("/test", verifyToken, adminMiddleware, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Admin access granted",
  });
});
router.get("/users",verifyToken,adminMiddleware,getUsers);
module.exports = router;
