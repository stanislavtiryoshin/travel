const Sanatorium = require("../models/sanatoriumModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//@desc   Add new hotel
//@route  POST /api/hotels
//@access Private

const addSanatorium = async (req, res) => {
  const { name, rating, description, rooms, mapLink, enterTime, leaveTime } =
    req.body;

  const post = await Sanatorium.create({
    name,
    rating,
    description,
    rooms,
    mapLink,
    enterTime,
    leaveTime,
  });

  res.status(200).json(post);
};

const getSanatoriums = (req, res) => {
  Sanatorium.find()
    .populate("locationId")
    .populate("sanatoriumProgram.programId")
    .then((response) => res.status(200).json(response))
    .catch((err) => res.sendStatus(404));
};

// TODO: Спросить у Стаса
const getAdminSanatoriums = (req, res) => {
  const { name, locationId, minAge } = req.query;
};

const getSingleSanatorium = (req, res) => {
  Sanatorium.findById(req.params.id)
    .populate("locationId")
    .populate("sanatoriumProgram.programId")
    .then((response) => res.status(200).json(response))
    .catch((err) => res.sendStatus(404));
};

module.exports = {
  getSingleSanatorium,
  getSanatoriums,
  addSanatorium,
  // TODO!: Спросить
  // getAdminSanatoriums,
};
