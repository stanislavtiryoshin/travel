const express = require("express");
const router = express.Router();
const {
  getRooms,
  addRoom,
  getSingleRoom,
  updateRoom,
  insertPrices,
} = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getRooms);
router.post("/", protect, addRoom);
router.get("/:roomId", protect, getSingleRoom);
router.patch("/:roomId", protect, updateRoom);
router.patch("/:roomId/prices", protect, insertPrices);

module.exports = router;
