const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Hotel = require("../models/hotelModel");
const Excursion = require("../models/excursionModel");

//@desc   Get excursion by location
//@route  GET /api/excursions
//@access Public

const getExcursions = asyncHandler(async (req, res) => {
  const excursions = await Excursion.find({
    location: req.query["location"],
  });
  res.status(200).send(excursions);
});

module.exports = {
  getExcursions,
};
