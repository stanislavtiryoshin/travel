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
const Tour = require("../models/tourModel");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("./uploadRoutes");

router.get("/", getTour);
router.get("/:id", getSingleTour);
router.post("/", protect, addTour);
router.delete("/:id", protect, deleteTour);
router.patch("/:id", protect, updateTour);

// router.patch("/:tourId/tourPrices", upload.single("file"), insertTourPrices);
router.get("/searched/query", getSearchedTour);

router.patch("/:tourId/upload", upload.array("images", 5), (req, res) => {
  const filePath = req.files.map(
    (file) => `http://localhost:5000/images/${file.filename}`
  );

  Tour.updateOne(
    { _id: req.params.tourId },
    {
      $set: {
        img: filePath,
      },
    }
  )
    .then((response) => res.status(201).json(response))
    .catch(() => res.sendStatus(500));
});

module.exports = router;
