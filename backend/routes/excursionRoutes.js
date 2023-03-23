const express = require("express");
const router = express.Router();
const { getExcursions } = require("../controllers/excursionController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getExcursions);

module.exports = router;
