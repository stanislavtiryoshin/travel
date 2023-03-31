const { Router } = require("express");
const router = Router();

const {
  addSanatorium,
  getSanatoriums,
  getSingleSanatorium,
} = require("../controllers/sanatoryController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addSanatorium);
router.get("/", getSanatoriums);

router.get("/:id", getSingleSanatorium);

module.exports = router;
