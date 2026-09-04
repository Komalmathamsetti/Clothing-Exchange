const express = require("express");
const router = express.Router();
const {
  createSwapRequest,
  getSentRequests,
  getrecievedRequests,
  getSwapRequestById,
  acceptSwapRequest,
  rejectSwapRequest,
  cancelSwapRequest
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
// recieved requests
router.get(
  "/recieved",
  verifyToken,
  getrecievedRequests
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
// Cancel
router.patch(
  "/:id/cancel",
  verifyToken,
  cancelSwapRequest
);
module.exports = router;