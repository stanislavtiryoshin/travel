const Camp = require("../models/campModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//@desc   Get all camps
//@route  GET /api/camp
//@access Public

const getCamps = (req, res) => {
  Camp.find({})
    .populate("food.foodId")
    .populate("locationId")
    .then((response) => res.status(200).json(response))
    .catch(() => res.sendStatus(403));
};

//@desc   Add new camp
//@route  POST /api/camp
//@access Private

const addCamp = (req, res) => {
  const {
    name,
    locationId,
    food,
    locationFeature,
    mapLink,
    description,
    kids,
    comforts,
    rating,
    ratingVotes,
    payment,
    hotelName,
    hotelDescription,
    campProgram,
  } = req.body;

  Camp.create({
    name,
    locationId,
    food,
    locationFeature,
    mapLink,
    description,
    kids,
    comforts,
    rating,
    ratingVotes,
    payment,
    hotelName,
    hotelDescription,
    campProgram,
  })
    .then((response) => res.status(201).json(response))
    .catch(() => res.sendStatus(403));
};

const getSingleCamp = (req, res) => {
  const id = req.params.id;
  Camp.findById(id)
    .populate("food.foodId")
    .populate("locationId")
    .then((response) => res.status(200).json(response))
    .catch(() => res.sendStatus(403));
};

const deleteCamp = (req, res) => {
  const id = req.params.id;
  Camp.deleteOne({ _id: id })
    .then(() => res.status(200).send("Successfully deleted"))
    .catch(() => res.sendStatus(403));
};

const updateCamp = (req, res) => {
  const {
    name,
    locationId,
    food,
    locationFeature,
    mapLink,
    description,
    kids,
    comforts,
    rating,
    ratingVotes,
    payment,
    hotelName,
    hotelDescription,
    campProgram,
  } = req.body;
  const id = req.params.id;

  Camp.updateOne(
    { _id: id },
    {
      $set: {
        name,
        locationId,
        food,
        locationFeature,
        mapLink,
        description,
        kids,
        comforts,
        rating,
        ratingVotes,
        payment,
        hotelName,
        hotelDescription,
        campProgram,
      },
    }
  )
    .then((response) => res.status(201).json(response))
    .catch(() => res.sendStatus(405));
};

module.exports = {
  addCamp,
  deleteCamp,
  getSingleCamp,
  getCamps,
  updateCamp,
};
