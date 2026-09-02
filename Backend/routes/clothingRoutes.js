const express = require("express");
const router = express.Router();
const {
  createClothing,
  getCategories,
  getMyListings,
  getClothingById,
  updateClothing,
  deleteClothing,
  getAllClothings,
} = require("../controllers/clothingController");
const { verifyToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
router.get("/categories", verifyToken, getCategories);

router.get("/my-listings", verifyToken, getMyListings);

router.get("/", verifyToken, getAllClothings);

router.get("/:id", verifyToken, getClothingById);

router.post("/", verifyToken, upload.array("images", 5), createClothing);

router.put(
  "/:id",
  verifyToken,
  upload.array("images", 5),
  updateClothing
);

router.delete("/:id", verifyToken, deleteClothing);

module.exports = router;
