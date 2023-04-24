const express = require("express");
const router = express.Router();
const {
  getPeriods,
  addPeriod,
  getPeriodsByHotel,
  deletePeriod,
} = require("../controllers/periodController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getPeriods);
router.post("/", protect, addPeriod);
router.get("/:hotelId", getPeriodsByHotel);
router.delete("/", protect, deletePeriod);

module.exports = router;
