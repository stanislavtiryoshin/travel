const express = require("express");
const router = express.Router();
const { getHotelServices } = require("../controllers/hotelServiceController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getHotelServices);

module.exports = router;
