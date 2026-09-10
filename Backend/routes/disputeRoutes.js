const express = require("express");

const router = express.Router();

const {
  createDispute,
  getMyDisputes,
  getDisputeById,
  addDisputeMessage,
  getAllDisputes,
  updateDisputeStatus,
} = require("../controllers/disputeController");

const { verifyToken } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ============================================================
// USER ROUTES
// ============================================================

// Create a new dispute
router.post("/", verifyToken, createDispute);

// Get disputes involving the logged-in user
router.get("/my", verifyToken, getMyDisputes);

// ============================================================
// ADMIN ROUTES
// ============================================================

// Get all disputes - ADMIN ONLY
router.get("/admin/all", verifyToken, adminMiddleware, getAllDisputes);

// Update dispute status - ADMIN ONLY
router.patch(
  "/admin/:id/status",
  verifyToken,
  adminMiddleware,
  updateDisputeStatus,
);

// ============================================================
// DISPUTE DETAILS & MESSAGES
// ============================================================

// Get one dispute with complete conversation
router.get("/:id", verifyToken, getDisputeById);

// Add reply to dispute
// Can be used by either swapper or admin
router.post("/:id/messages", verifyToken, addDisputeMessage);

module.exports = router;
