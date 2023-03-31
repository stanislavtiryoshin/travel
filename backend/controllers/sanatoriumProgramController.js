const SanatoriumProgram = require("../models/sanatoriumProgramModel");

const getSanatoriumProgram = (req, res) => {
  SanatoriumProgram.find()
    .then((response) => res.status(200).send(response))
    .catch((err) => res.sendStatus(404));
};

module.exports = {
  getSanatoriumProgram,
};
