const { Router } = require("express");
const router = Router();

const {
  addSanatorium,
  getSanatoriums,
  getSingleSanatorium,
} = require("../controllers/sanatoryController");

const { protect } = require("../middleware/authMiddleware");

const Sanatorium = require("../models/sanatoriumModel");
const { upload } = require("./uploadRoutes");

router.post("/", protect, addSanatorium);
router.get("/", getSanatoriums);

router.get("/:id", getSingleSanatorium);

router.patch("/:id/upload", upload.array("images", 5), (req, res) => {
  const filePath = req.files.map(
    (file) => `http://localhost:5000/images/${file.filename}`
  );

  Sanatorium.updateOne({ _id: req.params.id }, { $set: { img: filePath } })
    .then((response) => res.status(201).json(response))
    .catch(() => res.sendStatus(500));
});

module.exports = router;
