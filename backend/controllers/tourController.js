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
    .populate("hotels")
    .populate("food")
    .populate("hotelId")

    .populate("comforts")
    .then((response) => res.status(200).json(response))
    .catch((err) => res.send(err));
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
    .populate("hotels")
    .populate("hotelId")
    .populate("food")
    .populate("comforts")
    .then((response) => res.status(200).json(response))
    .catch((err) => res.send(err));
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
    .catch((err) => res.status(403).json(err));
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
  const { locationId, duration, rating, paymentType, food } = req.query;

  let query = {};

  if (food && food.length > 0) {
    query.food = {
      $in: food,
    };
  }

  if (locationId && locationId !== "") {
    query.locationId = locationId;
  }

  if (duration && duration !== "") {
    query.duration = duration;
  }

  if (rating && rating !== "") {
    query.rating = rating;
  }
  if (paymentType && paymentType !== "") {
    query.payment = {
      paymentType: paymentType,
    };
  }

  Tour.find(query)
    .then((response) => res.status(200).json(response))
    .catch(() => res.sendStatus(404));
};

const tourByTagRecommendation = async (req, res) => {
  const { food, locationId, duration } = req.body;
  const query = {};
  const or = [];

  if (locationId) {
    query.locationId = {
      _id: locationId,
    };
    or.push(query);
  }

  if (duration) {
    query.duration = duration;
    or.push(query);
  }

  if (food && food.length > 0) {
    for (let i = 0; i < food.length; i++) {
      let q = {};
      if (food[i] !== "") {
        q.food = {
          $in: [food[i]],
        };
        or.push(q);
      }
    }
  }
  console.log(JSON.stringify(or, null, 2));
  try {
    const tours = await Tour.find({ $or: or })
      .limit(4)
      .populate("rooms")
      .populate("locationId")
      .populate("hotels")
      .populate("food")
      .populate("hotelId")

      .populate("comforts");

    if (tours.length === 0) {
      return res.sendStatus(404);
    } else {
      return res.status(200).json(tours);
    }
  } catch (error) {
    res.sendStatus(400);
  }
};

module.exports = {
  addTour,
  deleteTour,
  getSingleTour,
  getTour,
  updateTour,
  insertTourPrices,
  getSearchedTour,

  tourByTagRecommendation,
};
