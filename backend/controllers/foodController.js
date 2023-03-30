const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Food = require("../models/foodModel");

//@desc   Get all foods
//@route  GET /api/foods
//@access Public

const getAllFoods = asyncHandler(async (req, res) => {
  const foods = await Food.find();
  res.status(200).json(foods);
});

module.exports = {
  getAllFoods,
};
