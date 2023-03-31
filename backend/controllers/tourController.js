const Tour = require("../models/tourModel");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const getTour = (req, res) => {
  Tour.find({})
    .populate("tourProgram.programId")
    .populate("rooms")
    .populate("locationId")
    .then((response) => res.status(200).json(response))
    .catch(() => res.sendStatus(404));
};

const addTour = (req, res) => {
  const {
    name,
    locationId,
    locationFeature,
    departureCity,
    mapLink,
    rating,
    ratingVotes,
    description,
    duration,
    kids,
    payment,
    comforts,
    rooms,
    tourProgram,
  } = req.body;

  if (tourProgram.hasOwnProperty("programId")) {
    Tour.create({
      name,
      locationId,
      locationFeature,
      departureCity,
      mapLink,
      rating,
      ratingVotes,
      description,
      duration,
      kids,
      payment,
      comforts,
      rooms,
      tourProgram,
    })
      .then((response) => res.status(201).json(response))
      .catch(() => res.sendStatus(403));
  } else {
    res.sendStatus(405);
  }
};

const getSingleTour = (req, res) => {
  const id = req.params.id;

  Tour.findById({ _id: id })
    .populate("tourProgram.programId")
    .populate("rooms")
    .populate("locationId")
    .then((response) => res.status(200).json(response))
    .catch(() => res.sendStatus(404));
};

const updateTour = (req, res) => {
  const id = req.params.id;
  const {
    name,
    locationId,
    locationFeature,
    departureCity,
    mapLink,
    rating,
    ratingVotes,
    description,
    duration,
    kids,
    payment,
    comforts,
    rooms,
    tourProgram,
  } = req.body;

  if (tourProgram.hasOwnProperty("programId")) {
    Tour.updateOne(
      { _id: id },
      {
        $set: {
          name,
          locationId,
          locationFeature,
          departureCity,
          mapLink,
          rating,
          ratingVotes,
          description,
          duration,
          kids,
          payment,
          comforts,
          rooms,
          tourProgram,
        },
      }
    )
      .then((response) => res.status(201).json(response))
      .catch(() => res.sendStatus(403));
  }
};

const deleteTour = (req, res) => {
  const id = req.params.id;

  Tour.deleteOne({ _id: id })
    .then(() => res.status(200).send("Successfully deleted"))
    .catch(() => res.sendStatus(403));
};

module.exports = {
  addTour,
  deleteTour,
  getSingleTour,
  getTour,
  updateTour,
};
