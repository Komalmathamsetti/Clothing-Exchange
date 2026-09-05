const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { calculateValue } = require("../controllers/valueController");
router.post("/",verifyToken,calculateValue);
module.exports = router;
