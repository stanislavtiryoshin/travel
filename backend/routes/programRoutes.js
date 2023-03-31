const { Router } = require("express");
const router = Router();

const { getProgram } = require("../controllers/programController");
const {
  getSanatoriumProgram,
} = require("../controllers/sanatoriumProgramController");

router.get("/", getProgram);
router.get("/sanatorium", getSanatoriumProgram);

module.exports = router;
