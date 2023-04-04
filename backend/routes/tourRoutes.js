const { Router } = require("express");
const router = Router();
const {
  addTour,
  deleteTour,
  getSingleTour,
  getTour,
  updateTour,
  getSearchedTour,
  insertTourPrices,
} = require("../controllers/tourController");

const { protect } = require("../middleware/authMiddleware");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/public/uploads`);
  },
  filename: function (req, file, cb) {
    cb(null, "tourPrice.csv");
  },
});

const upload = multer({ storage: storage });

router.get("/", getTour);
router.get("/:id", getSingleTour);
router.post("/", protect, addTour);
router.delete("/:id", protect, deleteTour);
router.patch("/:id", protect, updateTour);

router.patch("/:tourId/tourPrices", upload.single("file"), insertTourPrices);
router.get("/searched/query", getSearchedTour);

module.exports = router;
