const { Router } = require("express");
const router = Router();

const {
  addCamp,
  deleteCamp,
  getSingleCamp,
  updateCamp,
  getCamps,
} = require("../controllers/campController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addCamp);
router.get("/", getCamps);
router.get("/:id", getSingleCamp);
router.delete("/:id", protect, deleteCamp);
router.patch("/:id", protect, updateCamp);

module.exports = router;
