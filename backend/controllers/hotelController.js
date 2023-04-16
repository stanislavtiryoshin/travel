const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { Hotel } = require("../models/hotelModel");
const Room = require("../models/roomModel");
const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");
const Tour = require("../models/tourModel");

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
  // Delete period from hotel
  const hotel = await Hotel.findByIdAndUpdate(req.params.hotelId, {
    $pull: {
      periods: {
        _id: req.body.periodId,
      },
    },
  });

  // Delete periodPrices with the recieved periodId from this hotel's rooms
  try {
    for (const room of hotel.rooms) {
      await Room.findByIdAndUpdate(room, {
        $pull: {
          periodPrices: {
            periodId: req.body.periodId,
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
  const hotel = await Hotel.findByIdAndUpdate(
    req.params.hotelId,
    { periods: req.body.periods },
    {
      new: true,
    }
  );
  try {
    hotel.rooms.forEach((room) =>
      Room.findByIdAndUpdate(room, {
        $pull: {
          periodPrices: {
            periodId: {
              $nin: req.body.periods.map((period) => period.periodId),
            },
          },
        },
      })
    );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  res.status(200).json(hotel);
});

//@desc   Get all hotels
//@route  GET /api/hotels
//@access Public

const getHotels = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find()
    .populate("locationId")
    .populate("food")
    .populate("rooms")
    .populate("hotelServices");
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
    .populate("hotelServices");

  res.status(200).json(hotels);
});

//@desc   Get hotel by id
//@route  GET /api/hotels/:id
//@access Public

const getSingleHotel = asyncHandler(async (req, res) => {
  const singleHotel = await Hotel.findById(req.params.id)
    .populate("locationId")
    .populate("food")
    .populate("rooms");
  res.status(200).json(singleHotel);
});

//@desc   Get searched hotels
//@route  GET /api/hotels/searched
//@access Public

const getSearchedHotels = asyncHandler(async (req, res) => {
  const { peopleAmount, daysAmount, startDate, locationId } = req.query;

  const calculatePrice = (start, daysNum, basePrice, pricesArray) => {
    let daysArray = [];
    const startingDate = new Date(+start);

    console.log(startingDate);

    for (let i = 0; i < daysNum; i++) {
      let date = new Date();
      date.setDate(startingDate.getDate() + i);
      daysArray.push(date);
    }

    let sum = 0;

    const findPriceByDate = (date) => {
      if (pricesArray && pricesArray.length > 0) {
        pricesArray.forEach((el) => {
          console.log(el.startMonth, el.endMonth, el.startDay, el.endDay);
          console.log(date.getMonth() + 1, date.getDate());
          // console.log(el.roomPrice);
          if (
            date.getMonth() + 1 > el.startMonth &&
            date.getMonth() + 1 < el.endMonth
          ) {
            sum += el.roomPrice;
            console.log(1);
          } else if (
            date.getMonth() + 1 === el.startMonth &&
            date.getMonth() + 1 === el.endMonth &&
            date.getDate() >= el.startDay &&
            date.getDate() <= el.endDay
          ) {
            sum += el.roomPrice;
            console.log(2);
          } else if (
            date.getMonth() + 1 === el.startMonth &&
            date.getDate() >= el.startDay
          ) {
            sum += el.roomPrice;
            console.log(3);
          } else if (
            date.getMonth() + 1 === el.endMonth &&
            date.getDate() <= el.endDay
          ) {
            sum += el.roomPrice;
            console.log(4);
          } else {
            sum += basePrice;
            console.log(5);
          }
        });
      }
    };

    for (let i = 0; i < daysNum; i++) {
      findPriceByDate(daysArray[i]);
      break;
    }

    return sum;
  };

  let costArray = [];

  let hotels = [];

  if (locationId !== "") {
    hotels = await Hotel.find({
      locationId: locationId,
    })
      .populate("locationId")
      .populate("food")
      .populate("rooms");
  } else {
    hotels = await Hotel.find()
      .populate("locationId")
      .populate("food")
      .populate("rooms");
  }

  const newHotels = hotels.map((hotel) => {
    const newHotel = hotel.toObject();
    const rooms = newHotel.rooms;
    const cheapestRoom = rooms.reduce(
      (prev, curr) => (prev.roomPrice < curr.roomPrice ? prev : curr),
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

    return newHotel;
  });

  res.status(200).send(newHotels);
});

const getRoomPrices = (req, res) => {
  Hotel.findOne({ _id: req.params.hotelId })
    .populate("rooms")
    .then((response) => res.status(200).json(response.rooms))
    .catch(() => res.sendStatus(400));
};

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

const getByTagRecommendation = async (req, res) => {
  const { food, comforts } = req.body;
  let query = {};
  let or = [];

  if (food) {
    query.food = {
      _id: food,
    };
    // query.food._id = food;

    or.push(query);
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
      .populate("locationId")
      .populate("food");

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
  //test
  getRoomPrices,
  getRoomsByLimit,
  getByTagRecommendation,
};

// const getSearchedHotels = asyncHandler(async (req, res) => {
//   const { peopleAmount, daysAmount, startDate, locationId } = req.query;

//   const calculatePrice = (start, daysNum, basePrice, pricesArray) => {
//     let daysArray = [];
//     const startingDate = new Date(+start);

//     console.log(startingDate);

//     for (let i = 0; i < daysNum; i++) {
//       let date = new Date();
//       date.setDate(startingDate.getDate() + i);
//       daysArray.push(date);
//     }

//     let sum = 0;

//     const findPriceByDate = (date) => {
//       if (pricesArray && pricesArray.length > 0) {
//         pricesArray.forEach((el) => {
//           console.log(el.startMonth, el.endMonth, el.startDay, el.endDay);
//           console.log(date.getMonth() + 1, date.getDate());
//           console.log(el.roomPrice);
//           if (
//             date.getMonth() + 1 >= el.startMonth &&
//             date.getMonth() + 1 <= el.endMonth &&
//             date.getDate() >= el.startDay &&
//             date.getDate() <= el.endDay &&
//             el.roomPrice
//           ) {
//             sum += el.roomPrice;
//             console.log("****************");
//           } else {
//             sum += basePrice;
//             console.log("****************");
//           }
//         });
//       } else {
//         sum += basePrice;
//       }
//       return;
//     };

//     for (let i = 0; i < daysNum; i++) {
//       findPriceByDate(daysArray[i]);
//     }

//     return sum;
//   };

//   let costArray = [];

//   let hotels = [];

//   if (locationId !== "") {
//     hotels = await Hotel.find({
//       locationId: locationId,
//     })
//       .populate("locationId")
//       .populate("food")
//       .populate("rooms");
//   } else {
//     hotels = await Hotel.find()
//       .populate("locationId")
//       .populate("food")
//       .populate("rooms");
//   }

//   const newHotels = hotels.map((hotel) => {
//     const newHotel = hotel.toObject();
//     const rooms = newHotel.rooms;
//     const cheapestRoom = rooms.reduce(
//       (prev, curr) => (prev.roomPrice < curr.roomPrice ? prev : curr),
//       rooms[0]
//     );
//     const basePrice = cheapestRoom?.roomPrice;
//     const pricesArray = cheapestRoom?.periodPrices;

//     const costOfStay = calculatePrice(
//       startDate,
//       daysAmount,
//       basePrice,
//       pricesArray
//     );

//     if (cheapestRoom && cheapestRoom.discount && cheapestRoom.discount !== 0) {
//       newHotel.totalPrice = (costOfStay * (100 - cheapestRoom.discount)) / 100;
//       newHotel.oldPrice = costOfStay;
//     } else if (cheapestRoom) {
//       newHotel.totalPrice = costOfStay;
//     } else {
//       newHotel.totalPrice = 22800;
//     }

//     return newHotel;
//   });

//   res.status(200).send(newHotels);
// });
