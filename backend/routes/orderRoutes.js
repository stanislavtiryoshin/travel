const express = require("express");
const router = express.Router();
const {
  addOrder,
  getOrders,
  updateOrder,
  getSingleOrder,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", addOrder);
router.get("/", protect, getOrders);
router.patch("/:id", updateOrder);
router.get("/:orderId", getSingleOrder);

module.exports = router;
