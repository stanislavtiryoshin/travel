const express = require("express");
const router = express.Router();
const {
  getLocation,
  getAllLocations,
} = require("../controllers/locationController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:locationId", getLocation);
router.get("/", getAllLocations);

module.exports = router;
