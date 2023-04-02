const Tour = require("../models/tourModel");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const getTour = (req, res) => {
  Tour.find({})
    .populate("rooms")
    .populate("locationId")
    .populate("hotelId")
    // .populate("food")
    .then((response) => res.status(200).json(response))
    .catch(() => res.sendStatus(404));
};

const addTour = (req, res) => {
  Tour.create(req.body)
    .then((response) => res.status(201).json(response))
    .catch(() => res.sendStatus(403));
};

const getSingleTour = (req, res) => {
  const id = req.params.id;

  Tour.findById(id)
    .populate("rooms")
    .populate("locationId")
    .populate("hotelId")

    .then((response) => res.status(200).json(response))
    .catch(() => res.sendStatus(404));
};

const updateTour = (req, res) => {
  const id = req.params.id;

  Tour.updateOne(
    { _id: id },
    {
      $set: req.body,
    }
  )
    .then((response) => res.status(201).json(response))
    .catch(() => res.sendStatus(403));
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
