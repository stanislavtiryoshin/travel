const Camp = require("../models/campModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//@desc   Get all camps
//@route  GET /api/camp
//@access Public

const getCamps = (req, res) => {
  const { locationId } = req.query;
  const query = {};

  if (locationId && locationId != "") {
    query.locationId = locationId;
  }

  Camp.find(query)
    // .populate("food.foodId")
    .populate("locationId")
    // .populate("comforts")
    .then((response) => res.status(200).json(response))
    .catch(() => res.sendStatus(403));
};

//@desc   Add new camp
//@route  POST /api/camp
//@access Private

const addCamp = (req, res) => {
  Camp.create(req.body)
    .then((response) => res.status(201).json(response))
    .catch(() => res.sendStatus(403));
};

const getSingleCamp = (req, res) => {
  const id = req.params.id;
  Camp.findById(id)
    // .populate("food.foodId")
    .populate("locationId")
    // .populate("comforts")
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
  const id = req.params.id;

  Camp.updateOne(
    { _id: id },
    {
      $set: req.body,
    }
  )
    .then((response) => res.status(201).json(response))
    .catch(() => res.sendStatus(405));
};

const getCampByTags = async (req, res) => {
  const { location } = req.query;
  const query = {};
  if (location) {
    query.location = location;
  }
  try {
    const camps = await Camp.find(query).limit(4);
    if (camps.length === 0) {
      res.sendStatus(404);
    } else {
      res.status(200).json(camps);
    }
  } catch (error) {
    res.sendStatus(500);
  }
};

module.exports = {
  addCamp,
  deleteCamp,
  getSingleCamp,
  getCamps,
  updateCamp,
  getCampByTags,
};
