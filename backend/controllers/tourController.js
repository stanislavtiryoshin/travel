const Tour = require("../models/tourModel");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");

const fs = require("fs");
const csv = require("fast-csv");

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

const insertTourPrices = expressAsyncHandler(async (req, res) => {
  let totalRecords = [];
  try {
    fs.createReadStream(req.file.path)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => console.error(error))
      .on("data", (row) => {
        totalRecords.push(row);
      })
      .on("end", async (rowCount) => {
        try {
          await Tour.findByIdAndUpdate(
            req.params.tourId,
            {
              price: totalRecords,
            },
            {
              new: true,
            }
          );

          res.status(200).send(totalRecords);
        } catch (err) {
          res.sendStatus(400);
        }
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const getSearchedTour = (req, res) => {
  const { locationId, duration, rating, startDay, startMonth } = req.query;

  let query = {};

  if (locationId) {
    query.locationId = locationId;
  }

  if (duration) {
    query.duration = duration;
  }

  if (rating) {
    query.rating = rating;
  }

  if (startDay) {
    query.startDay = startDay;
  }

  if (startMonth) {
    query.startMonth = startMonth;
  }

  // console.log(query);

  Tour.find(query)
    .then((response) => res.status(200).json(response))
    .catch(() => res.sendStatus(404));
};

module.exports = {
  addTour,
  deleteTour,
  getSingleTour,
  getTour,
  updateTour,
  insertTourPrices,
  getSearchedTour,
};
