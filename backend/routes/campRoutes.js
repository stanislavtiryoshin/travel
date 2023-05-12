const { Router } = require("express");
const router = Router();

const {
  addCamp,
  deleteCamp,
  getSingleCamp,
  updateCamp,
  getCamps,
  getCampByTags,
  getPrice,
} = require("../controllers/campController");
const Camp = require("../models/campModel");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("./uploadRoutes");

router.post("/", protect, addCamp);
router.get("/", getCamps);
router.get("/price", getPrice);
router.get("/:id", getSingleCamp);
router.delete("/:id", protect, deleteCamp);
router.patch("/:id", protect, updateCamp);

router.patch("/:id/upload", upload.array("images", 5), (req, res) => {
  const filePath = req.files.map(
    (file) => `http://localhost:5000/images/${file.filename}`
  );
  Camp.updateOne({ _id: req.params.id }, { $set: { img: filePath } })
    .then((response) => res.status(201).json(response))
    .catch(() => res.sendStatus(500));
});

router.post("/recommendation", getCampByTags);

module.exports = router;
