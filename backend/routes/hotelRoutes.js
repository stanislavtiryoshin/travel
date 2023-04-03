const express = require("express");
const router = express.Router();
const {
  addHotel,
  getHotels,
  getSearchedHotels,
  getSingleHotel,
  getAdminHotels,
  updateHotel,
  insertPrices,
} = require("../controllers/hotelController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addHotel);
router.get("/", getHotels);
router.get("/searched", getSearchedHotels);
router.get("/admin", getAdminHotels);
router.patch("/:hotelId", protect, updateHotel);
router.get("/:id", getSingleHotel);
router.patch("/:hotelId/prices", protect, insertPrices);

module.exports = router;
