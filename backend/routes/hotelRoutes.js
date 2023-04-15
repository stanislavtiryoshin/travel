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

const { Hotel } = require("../models/hotelModel");

const { upload } = require("./uploadRoutes");

router.post("/", protect, addHotel);
router.get("/", getHotels);
router.get("/searched", getSearchedHotels);
router.get("/admin", getAdminHotels);
router.patch("/:hotelId", protect, updateHotel);
router.get("/:id", getSingleHotel);
router.patch("/:hotelId/periods", protect, updateHotelPeriods);
router.patch("/:hotelId/delete-period", protect, deletePeriod);

//test
router.get("/:hotelId/room", getRoomsByLimit);
router.post("/hotelRecommendation/tags", getByTagRecommendation);

router.patch("/:hotelId/upload", upload.array("images", 5), (req, res) => {
  const filePath = req.files.map(
    (file) => `http://localhost:5000/images/${file.filename}`
  );
  res.send(filePath);
  // Hotel.updateOne(
  //   { _id: req.params.hotelId },
  //   {
  //     $set: {
  //       img: filePath,
  //     },
  //   }
  // )
  //   .then((response) => res.status(201).json(response))
  //   .catch(() => res.sendStatus(500));
});

module.exports = router;
