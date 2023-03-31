const { Router } = require("express");
const router = Router();
const {
  addTour,
  deleteTour,
  getSingleTour,
  getTour,
  updateTour,
} = require("../controllers/tourController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", getTour);
router.get("/:id", getSingleTour);
router.post("/", protect, addTour);
router.delete("/:id", protect, deleteTour);
router.patch("/:id", protect, updateTour);

module.exports = router;
