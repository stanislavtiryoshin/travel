const Camp = require("../models/campModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { isDateInRange } = require("../dateUtils");
const Period = require("../models/periodModel");
const mongoose = require("mongoose");

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
//@route  POST /api/camp/
//@access Private

const addCamp = (req, res) => {
  Camp.create(req.body)
    .then((response) => res.status(201).json(response))
    .catch(() => res.sendStatus(403));
};

//@desc   Get single camp
//@route  GET /api/camps/:id
//@access Public

const getSingleCamp = (req, res) => {
  const id = req.params.id;

  Camp.findById(id)
    .populate("locationId")
    .populate("periods")
    .populate({
      path: "agePrices",
      populate: {
        path: "periodPrices.period",
        model: "Period",
      },
    })
    .then((response) => res.status(200).json(response))
    .catch((er) => res.status(403).json(er));
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

//@desc   Update individual agePrice
//@route  PATCH /api/camps/ageprice/:campId
//@access Public

const updateAgePriceById = asyncHandler(async (req, res) => {
  const { campId } = req.params;
  const { periodPrices } = req.body;
  const agePriceId = new mongoose.Types.ObjectId(req.body.agePriceId);
  const newCampId = new mongoose.Types.ObjectId(campId);

  // const newageprice = await Camp.findOne({
  //   _id: newCampId,
  //   "agePrices._id": agePriceId,
  // });

  // console.log(newageprice, "newageprice");

  const agePrice = await Camp.findOneAndUpdate(
    { _id: newCampId, "agePrices._id": agePriceId },
    { $set: { "agePrices.$.periodPrices": periodPrices } },
    { new: true }
  );

  if (!agePrice) {
    return res.status(404).json({ error: "Age price not found" });
  }

  res.status(200).json(agePrice);
});

//@desc   Get camp price
//@route  GET /api/camps/price
//@access Public

const getPrice = asyncHandler(async (req, res) => {
  const { campId, agesArray, start, daysAmount } = req.query;

  ages = agesArray.split(",").map(Number);
  console.log(ages, "ages");

  const camp = await Camp.findById(campId).populate({
    path: "periodPrices",
    populate: { path: "period", model: "Period" },
  });

  const pricesArray = camp.periodPrices;
  let sum = 0;

  (function calculatePrice(basePrice) {
    let daysArray = [];
    const startingDate = new Date(+start);

    for (let i = 0; i < daysAmount; i++) {
      let date = new Date(startingDate.getTime());
      date.setDate(startingDate.getDate() + i);
      daysArray.push(date);
    }

    const findPriceByDate = (date) => {
      if (pricesArray && pricesArray.length > 0) {
        let priceFound = false;
        pricesArray.forEach((el) => {
          const startMonth = el.period.startMonth;
          const startDay = el.period.startDay;
          const endMonth = el.period.endMonth;
          const endDay = el.period.endDay;

          let allAgesMatched = true;

          if (isDateInRange(date, startMonth, startDay, endMonth, endDay)) {
            ages.forEach((age) => {
              let ageMatchedToPrice = false; // Flag to track if the age matches with any price
              el.prices.forEach((price) => {
                if (age >= price.minAge && age <= price.maxAge) {
                  sum += price.campPrice;
                  ageMatchedToPrice = true; // Set the flag to true if the age matches with any price
                }
              });
              if (!ageMatchedToPrice) {
                console.log(`Age ${age} doesn't fit`);
                allAgesMatched = false; // Set the flag to false if any age doesn't match any price
              }
            });

            priceFound = true;
          }
          if (!allAgesMatched) {
            return res.status(404).json("Not all ages fit this camp");
          }
        });
        if (!priceFound) {
          return res.status(404).json("Could not find periods for these dates");
        }
      } else {
        return res.status(404).json("This camp has no prices set");
      }
    };

    for (let i = 0; i < daysAmount; i++) {
      findPriceByDate(daysArray[i]);
    }
  })(1);

  return res.status(200).json(sum);
});

//@desc   Get searched camps
//@route  GET /api/camps/searched
//@access Public

const getSearchedCamps = asyncHandler(async (req, res) => {
  const {
    agesArray,
    peopleAmount,
    daysAmount,
    start,
    locationId,
    adultsAmount,
    kidsAmount,
  } = req.query;

  ages = agesArray.split(",").map(Number);
  console.log(ages, "ages");

  const calculatePrice = (start, daysNum, pricesArray) => {
    let daysArray = [];
    const startingDate = new Date(+start);

    for (let i = 0; i < daysNum; i++) {
      let date = new Date(startingDate.getTime());
      date.setDate(startingDate.getDate() + i);
      daysArray.push(date);
    }

    let sum = 0;

    const findPriceByDate = (date) => {
      if (pricesArray && pricesArray.length > 0) {
        let priceFound = false;
        pricesArray.forEach((el) => {
          const startMonth = el.period.startMonth;
          const startDay = el.period.startDay;
          const endMonth = el.period.endMonth;
          const endDay = el.period.endDay;

          let allAgesMatched = true;

          if (isDateInRange(date, startMonth, startDay, endMonth, endDay)) {
            ages.forEach((age) => {
              let ageMatchedToPrice = false; // Flag to track if the age matches with any price
              el.prices.forEach((price) => {
                if (age >= price.minAge && age <= price.maxAge) {
                  sum += price.campPrice;
                  ageMatchedToPrice = true; // Set the flag to true if the age matches with any price
                }
              });
              if (!ageMatchedToPrice) {
                console.log(`Age ${age} doesn't fit`);
                allAgesMatched = false; // Set the flag to false if any age doesn't match any price
              }
            });

            priceFound = true;
          }
          if (!allAgesMatched) {
            console.log("Not all ages fit this camp");
          }
        });
        if (!priceFound) {
          console.log("Could not find periods for these dates");
        }
      } else {
        console.log("This camp has no prices set");
      }
    };

    for (let i = 0; i < daysNum; i++) {
      findPriceByDate(daysArray[i]);
    }

    return sum;
  };

  const query = {};

  if (locationId && locationId !== "") {
    query.locationId = locationId;
  }

  let camps = await Camp.find(query)
    .populate({
      path: "periodPrices",
      populate: { path: "period", model: "Period" },
    })
    .populate("locationId");

  const newCamps = camps.map((camp) => {
    const newCamp = camp.toObject();
    const pricesArray = camp.periodPrices;

    const costOfStay = calculatePrice(start, daysAmount, pricesArray);

    return {
      ...newCamp,
      totalPrice: costOfStay,
      daysAmount: +daysAmount,
      nightsAmount: daysAmount - 1,
      adultsAmount: +adultsAmount,
      kidsAmount: +kidsAmount,
    };
  });

  res.status(200).send(newCamps);
});

module.exports = {
  addCamp,
  deleteCamp,
  getSingleCamp,
  getCamps,
  updateCamp,
  getCampByTags,
  getPrice,
  getSearchedCamps,
  updateAgePriceById,
};
