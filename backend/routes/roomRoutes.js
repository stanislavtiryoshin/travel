const express = require("express");
const router = express.Router();
const {
  getRooms,
  addRoom,
  getSingleRoom,
  updateRoom,
} = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getRooms);
router.post("/", protect, addRoom);
router.get("/:roomId", protect, getSingleRoom);
router.patch("/:roomid", protect, updateRoom);

module.exports = router;
