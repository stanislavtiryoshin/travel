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

//test
router.patch("/:hotelId/prices", upload.single("file"), insertPrices);

module.exports = router;
