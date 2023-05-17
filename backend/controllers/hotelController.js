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
const { isDateInRange } = require("../dateUtils");

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
  })
    .populate("locationId")
    .populate("food")
    .populate({
      path: "rooms",
      populate: {
        path: "periodPrices.period",
        model: "Period",
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
  res.status(200).json(hotel);
});

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
  let query = Hotel.findById(req.params.id)
    .populate("locationId")
    .populate("food")
    .populate({
      path: "rooms",
      populate: {
        path: "periodPrices.period",
        model: "Period",
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

  if (req.query.agesArray) {
    query = query.populate({
      path: "rooms",
      match: {
        $expr: {
          $gte: [
            {
              $sum: [
                "$capacity",
                {
                  $size: {
                    $filter: {
                      input: "$extraPlaces",
                      as: "extraPlace",
                      cond: { $ne: ["$$extraPlace.isBabyPlace", true] },
                    },
                  },
                },
              ],
            },
            { $size: req.query.agesArray },
          ],
        },
      },
    });
  }

  const singleHotel = await query.exec();
  res.status(200).json(singleHotel);
});

//@desc   Get searched hotels
//@route  GET /api/hotels/searched
//@access Public

const getSearchedHotels = asyncHandler(async (req, res) => {
  const {
    peopleAmount,
    daysAmount,
    start,
    locationId,
    adultsAmount,
    kidsAmount,
    filterFood,
    filterStars,
    filterRating,
    filterServices,
    filterBathroom,
    filterExtraPlaces,
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

  if (locationId && locationId !== "") {
    query.locationId = locationId;
  }
  if (filterFood && filterFood !== "") {
    query.food = {
      $in: filterFood.split(","),
    };
  }
  if (filterStars && filterStars !== undefined) {
    query.hotelStars = filterStars;
  }
  if (filterRating && filterRating !== undefined) {
    query.rating = {
      $in: filterRating.split(","),
    };
  }
  if (filterServices && filterServices.length > 0) {
    query.hotelServices = { $in: filterServices.split(",") };
  }

  let hotels = await Hotel.find(query)
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
  hotels = hotels
    .filter((hotel) =>
      hotel.rooms.some((room) =>
        filterBathroom ? room.bathroom.type === filterBathroom : true
      )
    )
    .filter((hotel) =>
      hotel.rooms.some((room) =>
        filterExtraPlaces ? room.extraPlaces.length > 0 : true
      )
    )
    .filter((hotel) => {
      return hotel.rooms.length > 0;
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
    console.log(cheapestRoom?.roomName);
    const basePrice = cheapestRoom?.roomPrice;
    const pricesArray = cheapestRoom?.periodPrices;

    const costOfStay = calculatePrice(
      start,
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
  let excursions = [];

  if (excursionsArray && excursionsArray.length > 0)
    excursions = excursionsArray?.split(",");

  console.log(excursions);

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
  let extraPlacesSum = 0;
  let roomSum = 0;
  let excursionsSum = 0;
  let foodSum = 0;
  let chosenPlaces = [];

  const extraPlacesAmount = ages.length - chosenRoom.capacity;

  console.log(extraPlacesAmount, "extraPlacesAmount");

  let placesArray = chosenRoom.extraPlaces;

  ages.sort((a, b) => b - a);

  const accomodatedAges = ages.splice(0, chosenRoom.capacity);

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

  console.log(chosenPlaces);

  sum = chosenPlaces.reduce((acc, place) => {
    if (addExtraFood !== "false" && !chosenRoom.extraFoodIncluded) {
      console.log("addExtraFood");
      return acc + (place.priceNoFood + place.foodPrice) * daysAmount;
    } else if (addExtraFood !== "true" && !chosenRoom.extraFoodIncluded) {
      console.log("!addExtraFood");
      return acc + place.priceNoFood * daysAmount;
    } else if (chosenRoom.extraFoodIncluded) {
      console.log("extra food already included");
      return acc + place.priceWithFood * daysAmount;
    }
  }, 0);

  extraPlacesSum = chosenPlaces.reduce((acc, place) => {
    if (addExtraFood !== "false" && !chosenRoom.extraFoodIncluded) {
      console.log("addExtraFood");
      return acc + (place.priceNoFood + place.foodPrice) * daysAmount;
    } else if (addExtraFood !== "true" && !chosenRoom.extraFoodIncluded) {
      console.log("!addExtraFood");
      return acc + place.priceNoFood * daysAmount;
    } else if (chosenRoom.extraFoodIncluded) {
      console.log("extra food already included");
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

          if (isDateInRange(date, startMonth, startDay, endMonth, endDay)) {
            if (!personMode) {
              sum += el.roomPrice;
              roomSum += el.roomPrice;
              console.log("sum += el.roomPrice");
              priceFound = true;
            } else {
              accomodatedAges.forEach((age) => {
                if (age === 1000) {
                  sum += el.adultPrice;
                  roomSum += el.roomPrice;
                  console.log("sum += el.adultPrice");
                } else {
                  sum += el.kidPrice;
                  roomSum += el.roomPrice;
                  console.log("sum += el.kidPrice;");
                }
              });
              priceFound = true;
            }
          }
        });
        if (!priceFound) {
          res.status(404).json("Could not find period for these dates");
        }
      } else {
        res.status(404).json("This room has no prices set");
      }
      console.log(sum);
    };

    for (let i = 0; i < daysNum; i++) {
      findPriceByDate(daysArray[i]);
    }

    (function calculateFood() {
      if (addRoomFood && kidsFoodAmount !== 0 && adultsFoodAmount !== 0) {
        for (let i = 0; i < daysAmount; i++) {
          for (let i = 0; i < kidsFoodAmount; i++) {
            sum += hotel.kidFoodPrice;
            foodSum += hotel.kidFoodPrice;
            console.log("kid food");
          }
          for (let i = 0; i < adultsFoodAmount; i++) {
            sum += hotel.adultFoodPrice;
            foodSum += hotel.adultFoodPrice;
            console.log("adult food");
          }
        }
      }
    })();

    async function calculateExcursionPrices() {
      if (excursions && excursions.length > 0) {
        for (const id of excursions) {
          const excursion = await Excursion.findById(id);
          if (excursion && excursion.price) {
            sum += excursion.price * agesArray.split(",").length;
            excursionsSum += excursion.price * agesArray.split(",").length;
          }
        }
      }
    }

    if (excursions && excursions.length > 0) {
      await calculateExcursionPrices();
    }
  }

  await calculatePrice(start, daysAmount, 2, chosenRoom.periodPrices);

  res.status(200).json({
    sum: sum * 1.1,
    margeSum: 0.1 * sum,
    extraPlacesSum: extraPlacesSum,
    excursionsSum: excursionsSum,
    foodSum: foodSum,
    roomSum: roomSum,
    kidsFoodAmount: kidsFoodAmount,
    adultsFoodAmount: adultsFoodAmount,
  });
});

//@desc   Get room by prices
//@route  GET /api/hotels/:hotelId/price
//@access Public

const getRoomPrices = (req, res) => {
  Hotel.findOne({ _id: req.params.hotelId })
    .populate("rooms")
    .then((response) => res.status(200).json(response.rooms))
    .catch(() => res.sendStatus(400));
};

// Get rooms with limit

const getRoomsByLimit = async (req, res) => {
  const { limit, capacity } = req.query;
  const { hotelId } = req.params;
  let roomData = [];

  try {
    const hotel = await Hotel.findOne({ _id: hotelId });

    try {
      const rooms = await Room.aggregate([
        {
          $match: {
            _id: {
              $in: hotel.rooms,
            },
            $expr: {
              $gte: [
                {
                  $sum: [
                    "$capacity",
                    {
                      $size: {
                        $filter: {
                          input: "$extraPlaces",
                          as: "extraPlace",
                          cond: { $ne: ["$$extraPlace.isBabyPlace", true] },
                        },
                      },
                    },
                  ],
                },
                parseInt(capacity),
              ],
            },
          },
        },
      ]);

      const realLimit = Math.min(rooms.length, parseInt(limit));

      const limitedRooms = rooms.slice(0, realLimit);

      const response = {
        totalRooms: rooms.length, // Include the total number of rooms in the response
        rooms: limitedRooms,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json(error);
    }
  } catch (err) {
    res.sendStatus(404);
  }
};

// const getRoomsByLimit = async (req, res) => {
//   const { limit, capacity } = req.query;
//   const { hotelId } = req.params;
//   let roomData = [];

//   try {
//     const hotel = await Hotel.findOne({ _id: hotelId });

//     try {
//       const rooms = await Room.aggregate([
//         {
//           $match: {
//             _id: {
//               $in: hotel.rooms,
//             },
//             $expr: {
//               $gte: [
//                 {
//                   $sum: [
//                     "$capacity",
//                     {
//                       $size: {
//                         $filter: {
//                           input: "$extraPlaces",
//                           as: "extraPlace",
//                           cond: { $ne: ["$$extraPlace.isBabyPlace", true] },
//                         },
//                       },
//                     },
//                   ],
//                 },
//                 parseInt(capacity),
//               ],
//             },
//           },
//         },
//         { $limit: parseInt(limit) }, // Add a $limit stage to restrict the number of returned documents
//       ]);

//       res.status(200).json(rooms);
//     } catch (error) {
//       res.status(500).json(error);
//     }
//   } catch (err) {
//     res.sendStatus(404);
//   }
// };

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
  // updateHotelPeriods,
  // deletePeriod,
  getPrice,
  //test
  getRoomPrices,
  getRoomsByLimit,
  getByTagRecommendation,
};
