const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUsers,
  deleteUsers,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getUsers);
router.post("/", registerUser);
router.post("/login", loginUser);

router.delete("/delete", deleteUsers);

module.exports = router;
