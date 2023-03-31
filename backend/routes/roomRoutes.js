const express = require("express");
const router = express.Router();
const { getRooms } = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getRooms);

module.exports = router;
