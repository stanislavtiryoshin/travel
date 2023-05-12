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
    // .populate("food.foodId")
    .populate("locationId")
    .populate({
      path: "periodPrices",
      populate: { path: "period", model: "Period" },
    })
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

          if (isDateInRange(date, startMonth, startDay, endMonth, endDay)) {
            el.prices.forEach((price) => {
              ages.forEach((age) => {
                if (age >= price.minAge && age <= price.maxAge) {
                  sum += price.campPrice;
                } else {
                  res.status(400).json("Not all the ages fit this camp");
                }
              });
            });

            // ages.forEach((age) => {
            //   if (age > tour.kids.kidMaxAge) {
            //     sum += el.adultPrice;
            //     console.log(el.adultPrice);
            //   } else if (
            //     age <= tour.kids.kidMaxAge &&
            //     age > tour.kids.babyMaxAge
            //   ) {
            //     sum += el.kidPrice;
            //     console.log(el.kidPrice);
            //   } else {
            //     console.log("baby for free");
            //   }
            // });

            priceFound = true;
          }
        });
        if (!priceFound) {
          res.status(404).json("Could not find periods for these dates");
        }
      } else {
        res.status(404).json("This camp has no prices set");
      }
    };

    for (let i = 0; i < daysAmount; i++) {
      findPriceByDate(daysArray[i]);
    }

    console.log(daysArray);
  })(1);

  res.status(200).json(sum);
});

module.exports = {
  addCamp,
  deleteCamp,
  getSingleCamp,
  getCamps,
  updateCamp,
  getCampByTags,
  getPrice,
};
