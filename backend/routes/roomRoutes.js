const express = require("express");
const router = express.Router();
const { getRooms, addRoom } = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getRooms);
router.post("/", protect, addRoom);

module.exports = router;
