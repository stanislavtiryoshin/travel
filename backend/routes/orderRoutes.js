const express = require("express");
const router = express.Router();
const {
  addOrder,
  getOrders,
  updateOrder,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", addOrder);
router.get("/", getOrders);
router.patch("/:id", updateOrder);

module.exports = router;
