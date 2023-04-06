const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const HotelService = require("../models/hotelServiceModel");

//@desc   Get all hotel services
//@route  GET /api/hotelServices
//@access Public

const getHotelServices = asyncHandler(async (req, res) => {
  const hotelServices = await HotelService.find().populate("category");
  res.status(200).send(hotelServices);
});

//@desc   Add new service
//@route  GET /api/hotelServices
//@access Public

const AddNewService = asyncHandler(async (req, res) => {
  const hotelServices = await HotelService.find().populate("category");
  res.status(200).send(hotelServices);
});

module.exports = {
  getHotelServices,
};
