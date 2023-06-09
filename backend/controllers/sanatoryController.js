const Sanatorium = require("../models/sanatoriumModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const addSanatorium = async (req, res) => {
  const post = await Sanatorium.create(req.body);

  res.status(200).json(post);
};

const getSanatoriums = (req, res) => {
  Sanatorium.find()
    .populate("locationId")
    .populate("sanatoriumProgram.programId")
    .then((response) => res.status(200).json(response))
    .catch((err) => res.sendStatus(403));
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
    .catch((err) => res.sendStatus(403));
};

module.exports = {
  getSingleSanatorium,
  getSanatoriums,
  addSanatorium,
  // TODO!: Спросить
  // getAdminSanatoriums,
};
