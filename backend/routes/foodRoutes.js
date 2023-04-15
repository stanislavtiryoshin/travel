const express = require("express");
const router = express.Router();
const { getAllFoods } = require("../controllers/foodController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getAllFoods);

module.exports = router;
