const express = require("express");
const router = express.Router();
const {
  createSwapRequest,
  getSentRequests,
  getReceivedRequests,
  getSwapRequestById,
  acceptSwapRequest,
  rejectSwapRequest,
} = require("../controllers/swapController");
const { verifyToken } = require("../middleware/authMiddleware");
// Send request
router.post(
  "/",
  verifyToken,
  createSwapRequest
);
// Sent requests
router.get(
  "/sent",
  verifyToken,
  getSentRequests
);
// Received requests
router.get(
  "/received",
  verifyToken,
  getReceivedRequests
);
// Single request
router.get(
  "/:id",
  verifyToken,
  getSwapRequestById
);
// Accept
router.put(
  "/:id/accept",
  verifyToken,
  acceptSwapRequest
);
// Reject
router.put(
  "/:id/reject",
  verifyToken,
  rejectSwapRequest
);
module.exports = router;