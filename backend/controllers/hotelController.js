const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { Hotel } = require("../models/hotelModel");
const Period = require("../models/periodModel");
const Excursion = require("../models/excursionModel");
const Room = require("../models/roomModel");
const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");
const Tour = require("../models/tourModel");
const queryString = require("querystring");
const mongoose = require("mongoose");

//@desc   Add new hotel
//@route  POST /api/hotels
//@access Private

const addHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.create(req.body);
  res.status(200).json(hotel);
});

//@desc   Update hotel
//@route  PATCH /api/hotels/:hotelId
//@access Private

const updateHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findByIdAndUpdate(req.params.hotelId, req.body, {
    new: true,
  });
  res.status(200).json(hotel);
});

//@desc   Delete period
//@route  PATCH /api/hotels/:hotelId/delete-period
//@access Private

const deletePeriod = asyncHandler(async (req, res) => {
  await Period.findByIdAndDelete(req.body.periodId);

  // Delete period from hotel
  const hotel = await Hotel.findByIdAndUpdate(
    req.params.hotelId,
    {
      $pull: {
        periods: req.body.periodId,
      },
    },
    { new: true }
  );

  // Delete periodPrices with the received periodId from this hotel's rooms
  try {
    for (const roomId of hotel.rooms) {
      await Room.findByIdAndUpdate(roomId, {
        $pull: {
          periodPrices: {
            period: req.body.periodId,
          },
        },
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

  res.status(200).json(hotel);
});

//@desc   Update hotel periods
//@route  PATCH /api/hotels/:hotelId/periods
//@access Private

const updateHotelPeriods = asyncHandler(async (req, res) => {
  try {
    for (let period of req.body.periods) {
      if (!period._id) {
        const newPeriod = new Period({
          startDay: +period.startDay,
          startMonth: +period.startMonth,
          endDay: +period.endDay,
          endMonth: +period.endMonth,
          hotel: req.params.hotelId,
        });
        await newPeriod.save();
      }
    }

    const hotel = await Hotel.findByIdAndUpdate(
      req.params.hotelId,
      { periods: req.body.periods },
      {
        new: true,
      }
    );

    // hotel.rooms.forEach((roomId) =>
    //   Room.findByIdAndUpdate(roomId, {
    //     $pull: {
    //       periodPrices: {
    //         periodId: {
    //           $nin: req.body.periods
    //             .filter((period) => period._id)
    //             .map((period) => mongoose.Types.ObjectId(period._id)),
    //         },
    //       },
    //     },
    //   })
    // );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  res.status(200).json("successfull");
});

//@desc   Get all hotels
//@route  GET /api/hotels
//@access Public

const getHotels = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find()
    .populate("locationId")
    .populate("food")
    .populate("rooms")
    .populate({
      path: "hotelServices",
      populate: {
        path: "category",
        model: "Category",
      },
    });
  res.status(200).json(hotels);
});

//@desc   Get all hotels for admin
//@route  GET /api/hotels/admin
//@access Private

const getAdminHotels = asyncHandler(async (req, res) => {
  const { name, locationId, minAge } = req.query;

  const query = {};

  if (name && name != "") {
    query.name = name;
  }

  if (minAge && minAge != 0) {
    query.minAge = minAge;
  }

  if (locationId && locationId != "") {
    query.locationId = locationId;
  }

  const hotels = await Hotel.find(query)
    .populate("locationId")
    .populate("food")
    .populate("rooms")
    .populate({
      path: "hotelServices",
      populate: {
        path: "category",
        model: "Category",
      },
    });

  res.status(200).json(hotels);
});

//@desc   Get hotel by id
//@route  GET /api/hotels/:id
//@access Public

const getSingleHotel = asyncHandler(async (req, res) => {
  const singleHotel = await Hotel.findById(req.params.id)
    .populate("locationId")
    .populate("food")
    .populate({
      path: "rooms",
      populate: {
        path: "periodPrices.period",
        model: "Period",
      },
      match: {
        $expr: {
          $gte: [
            { $sum: ["$capacity", { $size: "$extraPlaces" }] },
            +req.query.peopleAmount,
          ],
        },
      },
    })
    .populate("periods")
    .populate({
      path: "hotelServices",
      populate: {
        path: "category",
        model: "Category",
      },
    });
  res.status(200).json(singleHotel);
});

//@desc   Get searched hotels
//@route  GET /api/hotels/searched
//@access Public

const getSearchedHotels = asyncHandler(async (req, res) => {
  const {
    peopleAmount,
    daysAmount,
    startDate,
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

          if (
            (date.getMonth() + 1 > startMonth ||
              (date.getMonth() + 1 === startMonth &&
                date.getDate() >= startDay)) &&
            (date.getMonth() + 1 < endMonth ||
              (date.getMonth() + 1 === endMonth && date.getDate() <= endDay))
          ) {
            sum += el.roomPrice;
            priceFound = true;
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
  if (locationId !== "") {
    query.locationId = locationId;
  }

  const hotels = await Hotel.find(query)
    .populate("locationId")
    .populate("food")
    .populate("rooms")
    .populate({
      path: "rooms",
      populate: {
        path: "periodPrices.period",
        model: "Period",
      },
      match: {
        $expr: {
          $gte: [
            { $sum: ["$capacity", { $size: "$extraPlaces" }] },
            { $sum: [req.query.kidsAmount, req.query.adultsAmount] },
          ],
        },
      },
    })
    .populate({
      path: "hotelServices",
      populate: {
        path: "category",
        model: "Category",
      },
    });

  const newHotels = hotels.map((hotel) => {
    const newHotel = hotel.toObject();
    const rooms = newHotel.rooms;
    const cheapestRoom = rooms.reduce(
      (prev, curr) =>
        prev.periodPrices[0].roomPrice < curr.periodPrices[0].roomPrice
          ? prev
          : curr,
      rooms[0]
    );
    const basePrice = cheapestRoom?.roomPrice;
    const pricesArray = cheapestRoom?.periodPrices;

    const costOfStay = calculatePrice(
      startDate,
      daysAmount,
      basePrice,
      pricesArray
    );

    if (cheapestRoom && cheapestRoom.discount && cheapestRoom.discount !== 0) {
      newHotel.totalPrice = (costOfStay * (100 - cheapestRoom.discount)) / 100;
      newHotel.oldPrice = costOfStay;
    } else if (cheapestRoom) {
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

//@desc   Calculate the price of hotel
//@route  GET /api/hotels/:hotelId/price
//@access Public

const getPrice = asyncHandler(async (req, res) => {
  const {
    addRoomFood,
    addExtraFood,
    start,
    daysAmount,
    agesArray,
    hotelId,
    roomId,
    personMode,
    excursionsArray,
    kidsFoodAmount,
    adultsFoodAmount,
  } = req.query;

  let ages = agesArray.split(",").map(Number);
  let excursions = null;
  if (excursionsArray) {
    excursions = excursionsArray.split(",").map(Number);
  }

  const hotel = await Hotel.findById(hotelId)
    .populate("locationId")
    .populate("food")
    .populate({
      path: "rooms",
      populate: {
        path: "periodPrices.period",
        model: "Period",
      },
    })
    .populate({
      path: "hotelServices",
      populate: {
        path: "category",
        model: "Category",
      },
    });
  const chosenRoom = hotel.rooms.find((room) => room._id == roomId);

  let sum = 0;
  let chosenPlaces = [];

  const extraPlacesAmount = ages.length - chosenRoom.capacity;

  let placesArray = chosenRoom.extraPlaces;

  ages.sort((a, b) => b - a);

  const accomodatedAges = ages.splice(0, extraPlacesAmount);

  console.log(ages, "ages");

  const notChosen = (place) => !chosenPlaces.some((el) => el._id === place._id);

  ages.forEach((age) => {
    const matchingPlace = placesArray.find((place) => {
      if (age !== 1000 && notChosen(place)) {
        return true;
      } else if (age === 1000 && !place.isKid && notChosen(place)) {
        return true;
      } else {
        return false;
      }
    });
    if (matchingPlace) {
      chosenPlaces.push(matchingPlace);
    }
  });

  sum = chosenPlaces.reduce((acc, place) => {
    if (addExtraFood) {
      console.log("addExtraFood");

      return acc + (place.priceNoFood + place.foodPrice) * daysAmount;
    } else if (!addExtraFood) {
      console.log("!addExtraFood");

      return acc + place.priceNoFood * daysAmount;
    } else {
      console.log("extra food included");

      return acc + place.priceWithFood * daysAmount;
    }
  }, 0);

  async function calculatePrice(start, daysNum, basePrice, pricesArray) {
    let daysArray = [];
    const startingDate = new Date(+start);

    for (let i = 0; i < daysNum; i++) {
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

          // console.log(startDay, startMonth, endDay, endMonth);
          // console.log(date.getMonth() + 1, date.getDate());

          if (
            (date.getMonth() + 1 > startMonth ||
              (date.getMonth() + 1 === startMonth &&
                date.getDate() >= startDay)) &&
            (date.getMonth() + 1 < endMonth ||
              (date.getMonth() + 1 === endMonth && date.getDate() <= endDay))
          ) {
            // console.log(startDay, startMonth, endDay, endMonth, "period");
            // console.log(date.getMonth() + 1, date.getDate(), "date");

            if (!personMode) {
              sum += el.roomPrice;
              console.log("sum += el.roomPrice");
              priceFound = true;
            } else {
              accomodatedAges.forEach((age) => {
                if (age === 1000) {
                  sum += el.adultPrice;
                  console.log("sum += el.adultPrice");
                } else {
                  sum += el.kidPrice;
                  console.log("sum += el.kidPrice;");
                }
              });
              priceFound = true;
            }
          }
        });
        if (!priceFound) {
          res.sendStatus(404);
          console.log("!priceFound");
        }
      } else {
        res.sendStatus(404);
        console.log("else");
      }
      console.log(sum);
    };

    for (let i = 0; i < daysNum; i++) {
      findPriceByDate(daysArray[i]);
    }

    (function calculateFood() {
      if (addRoomFood && kidsFoodAmount != false && adultsFoodAmount != false) {
        for (let i = 0; i < daysAmount; i++) {
          for (let i = 0; i < kidsFoodAmount; i++) {
            sum += hotel.kidFoodPrice;
          }
          for (let i = 0; i < adultsFoodAmount; i++) {
            sum += hotel.adultFoodPrice;
          }
        }
      }
    })();

    async function calculateExcursionPrices() {
      if (excursions && excursions.length > 0) {
        for (const id of excursions) {
          const excursion = await Excursion.findById(
            new mongoose.Types.ObjectId(id)
          );
          if (excursion && excursion.price) {
            sum += excursion.price;
          }
        }
      }
    }

    if (excursions && excursions.length > 0) {
      await calculateExcursionPrices();
    }

    console.log(excursions, "excs");
  }

  await calculatePrice(start, daysAmount, 2, chosenRoom.periodPrices);

  res.status(200).json(sum);
});

// Get room by prices

const getRoomPrices = (req, res) => {
  Hotel.findOne({ _id: req.params.hotelId })
    .populate("rooms")
    .then((response) => res.status(200).json(response.rooms))
    .catch(() => res.sendStatus(400));
};

// Get rooms with limit

const getRoomsByLimit = async (req, res) => {
  const { limit } = req.query;
  const { hotelId } = req.params;
  let roomData = [];

  try {
    const hotels = await Hotel.findOne({ _id: hotelId });
    if (limit) {
      hotels.rooms.length = limit;
    }

    try {
      const rooms = await Room.find({
        _id: {
          $in: hotels.rooms,
        },
      });
      res.status(200).json(rooms);
    } catch (error) {
      res.sendStatus(400);
    }

    console.log(roomData);
  } catch (err) {
    res.sendStatus(404);
  }
};

// Get recommended hotels

const getByTagRecommendation = async (req, res) => {
  const { food, comforts, hotelServices } = req.body;
  let query = {};
  let or = [];

  if (food) {
    query.food = {
      _id: food,
    };

    or.push(query);
  }
  if (hotelServices && hotelServices.length > 0) {
    for (let i = 0; i < hotelServices.length; i++) {
      let q = {};
      if (hotelServices[i] !== "") {
        q.hotelServices = {
          $in: [hotelServices[i]],
        };
        or.push(q);
      }
    }
  }

  if (comforts && comforts.length > 0) {
    for (let i = 0; i < comforts.length; i++) {
      let q = {};
      if (comforts[i] !== "") {
        q.comforts = {
          $in: [comforts[i]],
        };
        or.push(q);
      }
    }
  }

  try {
    const hotels = await Hotel.find({ $or: or })
      .limit(4)
      .populate("locationId")
      .populate("food");
    // .populate("hotelServices._id");

    if (hotels.length === 0) {
      res.sendStatus(404);
    } else {
      res.status(200).json(hotels);
    }
  } catch (error) {
    res.sendStatus(400);
  }
};

module.exports = {
  addHotel,
  getHotels,
  getSearchedHotels,
  getSingleHotel,
  getAdminHotels,
  updateHotel,
  updateHotelPeriods,
  deletePeriod,
  getPrice,
  //test
  getRoomPrices,
  getRoomsByLimit,
  getByTagRecommendation,
};
