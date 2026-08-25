const express = require("express");
const router = express.Router();
const { getNearbyListings } = require("../controllers/nearbyController");
const { verifyToken } = require("../middleware/authMiddleware");
router.get("/",verifyToken,getNearbyListings);
module.exports = router;