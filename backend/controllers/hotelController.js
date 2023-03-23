const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Hotel = require("../models/hotelModel");

//@desc   Add new hotel
//@route  POST /api/hotels
//@access Private

const addHotel = asyncHandler(async (req, res) => {
  const reqRooms = req.body.rooms;
  const post = await Hotel.create({
    name: req.body.name,
    type: req.body.type,
    location: req.body.location,
    resort: req.body.resort,
    discount: req.body.discount,
    food: req.body.food,
    rating: req.body.rating,
    description: req.body.description,
    rooms: req.body.rooms,
  });
  res.status(200).json(post);
});

//@desc   Get all hotels
//@route  GET /api/hotels
//@access Public

const getHotels = asyncHandler(async (req, res) => {
  const todos = await Hotel.find().populate("locationId");
  res.status(200).json(todos);
});

//@desc   Get hotel by id
//@route  GET /api/hotels/:id
//@access Public

const getSingleHotel = asyncHandler(async (req, res) => {
  const singleHotel = await Hotel.findById(req.params.id).populate(
    "locationId"
  );
  res.status(200).json(singleHotel);
});

//@desc   Get searched hotels
//@route  GET /api/hotels/searched/:locationId
//@access Public

const getSearchedHotels = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find({
    locationId: req.params.locationId,
  }).populate("locationId");
  res.status(200).send(hotels);
});

module.exports = {
  addHotel,
  getHotels,
  getSearchedHotels,
  getSingleHotel,
};
