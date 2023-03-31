const Program = require("../models/programModel");

//@desc   Get all hotel services
//@route  GET /api/hotelServices
//@access Public

const getProgram = (req, res) => {
  Program.find()
    .then((response) => res.status(200).send(response))
    .catch((err) => res.sendStatus(404));
};

module.exports = {
  getProgram,
};
