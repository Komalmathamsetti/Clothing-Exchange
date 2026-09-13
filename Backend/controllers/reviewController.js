const pool = require("../config/db");

// =====================================================
// CREATE REVIEW
// =====================================================

exports.createReview = async (req, res) => {
  try {
    const reviewerId = req.user.id;

    const { swapRequestId, rating, comment } = req.body;

    // ---------------------------------------------
    // Validate required fields
    // ---------------------------------------------

    if (!swapRequestId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Swap request ID and rating are required",
      });
    }

    // ---------------------------------------------
    // Validate rating
    // ---------------------------------------------

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // ---------------------------------------------
    // Find successful swap
    // ---------------------------------------------

    const swapResult = await pool.query(
      `
            SELECT
                id,
                sender_id,
                reciever_id,
                status
            FROM swap_requests
            WHERE id = $1
            `,
      [swapRequestId],
    );

    if (swapResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Swap request not found",
      });
    }

    const swap = swapResult.rows[0];

    // ---------------------------------------------
    // Only successful swaps can be reviewed
    // ---------------------------------------------

    if (swap.status !== "ACCEPTED") {
      return res.status(400).json({
        success: false,
        message: "You can review only successful swaps",
      });
    }

    // ---------------------------------------------
    // Make sure reviewer participated in swap
    // ---------------------------------------------

    const senderId = Number(swap.sender_id);
    const receiverId = Number(swap.reciever_id);

    if (Number(reviewerId) !== senderId && Number(reviewerId) !== receiverId) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant in this swap",
      });
    }

    // ---------------------------------------------
    // Determine the person being reviewed
    // ---------------------------------------------

    const reviewedUserId =
      Number(reviewerId) === senderId ? receiverId : senderId;

    // ---------------------------------------------
    // Check if already reviewed
    // ---------------------------------------------

    const existingReview = await pool.query(
      `
            SELECT id
            FROM reviews
            WHERE swap_request_id = $1
              AND reviewer_id = $2
            `,
      [swapRequestId, reviewerId],
    );

    if (existingReview.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this swap",
      });
    }

    // ---------------------------------------------
    // Insert review
    // ---------------------------------------------

    const reviewResult = await pool.query(
      `
            INSERT INTO reviews (
                swap_request_id,
                reviewer_id,
                reviewed_user_id,
                rating,
                comment
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `,
      [
        swapRequestId,
        reviewerId,
        reviewedUserId,
        numericRating,
        comment?.trim() || null,
      ],
    );

    // ---------------------------------------------
    // Recalculate reviewed user's average rating
    // ---------------------------------------------

    const ratingResult = await pool.query(
      `
            SELECT
                ROUND(AVG(rating), 2) AS average_rating
            FROM reviews
            WHERE reviewed_user_id = $1
            `,
      [reviewedUserId],
    );

    const averageRating = ratingResult.rows[0]?.average_rating || 0;

    // ---------------------------------------------
    // Update users.rating
    // ---------------------------------------------

    await pool.query(
      `
            UPDATE users
            SET rating = $1
            WHERE id = $2
            `,
      [averageRating, reviewedUserId],
    );

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review: reviewResult.rows[0],
      averageRating: Number(averageRating),
    });
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit review",
    });
  }
};

// =====================================================
// GET REVIEWS RECEIVED BY USER
// =====================================================

exports.getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `
            SELECT
                r.id,
                r.swap_request_id,
                r.rating,
                r.comment,
                r.created_at,

                u.id AS reviewer_id,
                u.full_name AS reviewer_name,
                u.profile_image AS reviewer_image

            FROM reviews r

            INNER JOIN users u
                ON r.reviewer_id = u.id

            WHERE r.reviewed_user_id = $1

            ORDER BY r.created_at DESC
            `,
      [userId],
    );

    return res.status(200).json({
      success: true,
      reviews: result.rows,
    });
  } catch (error) {
    console.error("GET USER REVIEWS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

// =====================================================
// CHECK WHETHER CURRENT USER REVIEWED A SWAP
// =====================================================

exports.checkReview = async (req, res) => {
  try {
    const reviewerId = req.user.id;
    const { swapId } = req.params;

    const result = await pool.query(
      `
            SELECT
                id,
                rating,
                comment,
                reviewed_user_id
            FROM reviews
            WHERE swap_request_id = $1
              AND reviewer_id = $2
            `,
      [swapId, reviewerId],
    );

    return res.status(200).json({
      success: true,
      reviewed: result.rows.length > 0,
      review: result.rows[0] || null,
    });
  } catch (error) {
    console.error("CHECK REVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to check review",
    });
  }
};

// =====================================================
// GET REVIEWS FOR A SWAP
// =====================================================

exports.getSwapReviews = async (req, res) => {
  try {
    const { swapId } = req.params;

    const result = await pool.query(
      `
            SELECT
                r.id,
                r.reviewer_id,
                r.reviewed_user_id,
                r.rating,
                r.comment,
                r.created_at,

                reviewer.full_name AS reviewer_name,
                reviewed.full_name AS reviewed_user_name

            FROM reviews r

            INNER JOIN users reviewer
                ON r.reviewer_id = reviewer.id

            INNER JOIN users reviewed
                ON r.reviewed_user_id = reviewed.id

            WHERE r.swap_request_id = $1

            ORDER BY r.created_at ASC
            `,
      [swapId],
    );

    return res.status(200).json({
      success: true,
      reviews: result.rows,
    });
  } catch (error) {
    console.error("GET SWAP REVIEWS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch swap reviews",
    });
  }
};
// =====================================================
// GET REVIEWS GIVEN BY CURRENT USER
// =====================================================

exports.getMyReviews = async (req, res) => {
  try {
    const reviewerId = req.user.id;

    const result = await pool.query(
      `
            SELECT
                r.id,
                r.swap_request_id,
                r.rating,
                r.comment,
                r.created_at,

                u.id AS reviewed_user_id,
                u.full_name AS reviewed_user_name,
                u.profile_image AS reviewed_user_image

            FROM reviews r

            INNER JOIN users u
                ON r.reviewed_user_id = u.id

            WHERE r.reviewer_id = $1

            ORDER BY r.created_at DESC
            `,
      [reviewerId],
    );

    return res.status(200).json({
      success: true,
      reviews: result.rows,
    });
  } catch (error) {
    console.error("GET MY REVIEWS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your reviews",
    });
  }
};
// =====================================================
// GET LATEST REVIEWS - PUBLIC
// =====================================================

exports.getLatestReviews = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        r.id,
        r.rating,
        r.comment,
        r.created_at,

        u.id AS reviewer_id,
        u.full_name AS reviewer_name,
        u.profile_image AS reviewer_image

      FROM reviews r

      INNER JOIN users u
        ON r.reviewer_id = u.id

      ORDER BY r.created_at DESC

      LIMIT 3
      `,
    );

    return res.status(200).json({
      success: true,
      reviews: result.rows,
    });
  } catch (error) {
    console.error("GET LATEST REVIEWS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch latest reviews",
    });
  }
};
