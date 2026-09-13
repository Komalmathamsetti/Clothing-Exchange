const express = require("express");

const router = express.Router();

const {
    createReview,
    getUserReviews,
    checkReview,
    getSwapReviews,
    getMyReviews,
    getLatestReviews
} = require("../controllers/reviewController");
const {
    verifyToken
} = require("../middleware/authMiddleware");
// Submit review
router.post(
    "/",
    verifyToken,
    createReview
);
router.get("/latest", getLatestReviews);
// Reviews received by a user
router.get(
    "/user/:userId",
    verifyToken,
    getUserReviews
);
router.get("/my", verifyToken, getMyReviews);
// Check whether current user reviewed a swap
router.get(
    "/check/:swapId",
    verifyToken,
    checkReview
);
// Get reviews belonging to a swap
router.get(
    "/swap/:swapId",
    verifyToken,
    getSwapReviews
);
module.exports = router;