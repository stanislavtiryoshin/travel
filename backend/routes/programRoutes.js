const { Router } = require("express");
const router = Router();

const {
  getProgram,
  addProgram,
  updateProgram,
  deleteProgram,
} = require("../controllers/programController");
const {
  getSanatoriumProgram,
  addSanatoriumProgram,
  deleteSanatoriumProgram,
  updateSanatoriumProgram,
} = require("../controllers/sanatoriumProgramController");
const { protect } = require("../middleware/authMiddleware");

// Programs
router.get("/", protect, getProgram);
router.post("/", protect, addProgram);
router.patch("/:id", protect, updateProgram);
router.delete("/:id", protect, deleteProgram);

// Sanatorium
router.get("/sanatorium", protect, getSanatoriumProgram);
router.post("/sanatorium", protect, addSanatoriumProgram);
router.patch("/sanatorium/:id", protect, updateSanatoriumProgram);
router.delete("/sanatorium/:id", protect, deleteSanatoriumProgram);

module.exports = router;
