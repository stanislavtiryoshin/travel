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
  getRoomPrices,
  insertTourPrices,
  getRoomsByLimit,
  updateHotelPeriods,
  deletePeriod,
  getByTagRecommendation,
} = require("../controllers/hotelController");
const { protect } = require("../middleware/authMiddleware");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/public/uploads`);
  },
  filename: function (req, file, cb) {
    cb(null, "addresses.csv");
  },
});

const upload = multer({ storage: storage });

router.post("/", protect, addHotel);
router.get("/", getHotels);
router.get("/searched", getSearchedHotels);
router.get("/admin", getAdminHotels);
router.patch("/:hotelId", protect, updateHotel);
router.get("/:id", getSingleHotel);
router.patch("/:hotelId/periods", protect, updateHotelPeriods);
router.patch("/:hotelId/delete-period", protect, deletePeriod);

//test
// router.patch("/:hotelId/prices", upload.single("file"), insertPrices);
router.get("/hotelRoomPrices/:hotelId", getRoomPrices);
router.get("/:hotelId/room", getRoomsByLimit);
router.post("/hotelRecommendation/tags", getByTagRecommendation);

module.exports = router;
