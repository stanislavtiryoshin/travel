const express = require("express");
const router = express.Router();
const {
  addHotel,
  getHotels,
  getSearchedHotels,
  getSingleHotel,
  getAdminHotels,
} = require("../controllers/hotelController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addHotel);
router.get("/", getHotels);
router.get("/searched", getSearchedHotels);
router.get("/admin", getAdminHotels);

router.get("/:id", getSingleHotel);

module.exports = router;
