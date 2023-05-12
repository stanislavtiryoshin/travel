const Tour = require("../models/tourModel");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const asyncHandler = require("express-async-handler");

const fs = require("fs");
const csv = require("fast-csv");
const { isDateInRange } = require("../dateUtils");

//@desc Get all tours
//@route GET /api/tour/
//@access Public

// const getTour = (req, res) => {
//   Tour.find({})
//     .populate("rooms")
//     .populate("locationId")
//     .populate("hotels")
//     .populate("food")
//     .populate("hotelId")
//     // .populate({
//     //   path: "tourServices",
//     //   populate: {
//     //     path: "category",
//     //     model: "Category",
//     //   },
//     // })
//     .populate({
//       path: "periodPrices",
//       populate: { path: "period", model: "Period" },
//     })
//     // .populate("comforts")
//     .then((response) => res.status(200).json(response))
//     .catch((err) => res.send(err));
// };

const getTour = asyncHandler(async (req, res) => {
  const tours = await Tour.find()
    .populate("rooms")
    .populate("locationId")
    .populate("hotels")
    .populate("food")
    .populate("hotelId")
    .populate({
      path: "periodPrices",
      populate: { path: "period", model: "Period" },
    })
    .populate({
      path: "tourServices",
      populate: {
        path: "category",
        model: "Category",
      },
    });

  res.status(200).json(tours);
});

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
    .populate({
      path: "tourServices",
      populate: {
        path: "category",
        model: "Category",
      },
    })
    .populate("hotels.room")
    .populate("hotels.hotel")
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

//@desc   Search tours
//@route  GET /api/tour/searched
//@access Public

const getSearchedTour = async (req, res) => {
  const {
    locationId,
    duration,
    rating,
    paymentType,
    food,
    agesArray,
    peopleAmount,
    daysAmount,
    start,
    adultsAmount,
    kidsAmount,
  } = req.query;

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

  ages = agesArray.split(",").map(Number);

  try {
    let tours = await Tour.find(query).populate({
      path: "periodPrices",
      populate: { path: "period", model: "Period" },
    });

    // tours.map((tour) => {
    //       const pricesArray = tour.periodPrices;
    //       let sum = 0;

    //   return { ...tour, totalCost: sum, adultsAmount, kidsAmount };
    // });

    res.status(200).json(tours);
  } catch (err) {
    res.sendStatus(404);
  }
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

//@desc Get tour price
//@route GET /api/tour/price
//@access Public

const getPrice = asyncHandler(async (req, res) => {
  const { tourId, agesArray, start, daysAmount } = req.query;

  ages = agesArray.split(",").map(Number);
  console.log(ages, "ages");

  const tour = await Tour.findById(tourId).populate({
    path: "periodPrices",
    populate: { path: "period", model: "Period" },
  });

  const pricesArray = tour.periodPrices;
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
            console.log(startDay, startMonth, endDay, endMonth, "period");
            console.log(date.getMonth() + 1, date.getDate(), "date");

            ages.forEach((age) => {
              if (age > tour.kids.kidMaxAge) {
                sum += el.adultPrice;
                console.log(el.adultPrice);
              } else if (
                age <= tour.kids.kidMaxAge &&
                age > tour.kids.babyMaxAge
              ) {
                sum += el.kidPrice;
                console.log(el.kidPrice);
              } else {
                console.log("baby for free");
              }
            });

            priceFound = true;
          }
        });
        if (!priceFound) {
          res.status(404).json("Could not find period for these dates");
        }
      } else {
        res.status(404).json("This tour has no prices set");
      }
    };

    for (let i = 0; i < daysAmount; i++) {
      findPriceByDate(daysArray[i]);
    }

    console.log(daysArray);
  })(1);

  res.status(200).json(sum);
});

//@desc   Get searched tours
//@route  GET /api/tour/searched
//@access Public

const getSearchedTours = asyncHandler(async (req, res) => {
  const {
    peopleAmount,
    daysAmount,
    start,
    locationId,
    adultsAmount,
    kidsAmount,
  } = req.query;

  const calculatePrice = (start, daysNum, basePrice, pricesArray) => {
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

          console.log(startDay, startMonth, endDay, endMonth, "period");
          console.log(date.getMonth() + 1, date.getDate(), "date");

          if (isDateInRange(date, startMonth, startDay, endMonth, endDay)) {
            sum += el.adultPrice * adultsAmount;
            sum += el.kidPrice * kidsAmount;
            priceFound = true;
            console.log("price was found");
          }
        });
        if (!priceFound) {
          sum += basePrice;
        }
      } else {
        sum += basePrice;
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

  let hotels = await Tour.find(query).populate({
    path: "periodPrices",
    populate: { path: "period", model: "Period" },
  });

  const newHotels = hotels.map((hotel) => {
    const newHotel = hotel.toObject();

    const pricesArray = hotel?.periodPrices;

    const costOfStay = calculatePrice(start, daysAmount, 1, pricesArray);

    if (pricesArray) {
      newHotel.totalPrice = costOfStay;
    } else {
      newHotel.totalPrice = 22800;
    }

    return {
      ...newHotel,
      daysAmount: +daysAmount,
      nightsAmount: daysAmount - 1,
      adultsAmount: +adultsAmount,
      kidsAmount: +kidsAmount,
    };
  });

  res.status(200).send(newHotels);
});

module.exports = {
  addTour,
  deleteTour,
  getSingleTour,
  getTour,
  updateTour,
  insertTourPrices,
  getSearchedTour,
  getPrice,
  getSearchedTours,
  tourByTagRecommendation,
};
