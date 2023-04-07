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
    hotel.rooms.forEach(
      async (room) =>
        await Room.findByIdAndUpdate(room, {
          $pull: {
            periodPrices: {
              periodId: { $nin: req.body.periods.map((period) => period._id) },
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
    .populate("rooms");
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
    .populate("rooms");

  res.status(200).json(hotels);
});

//@desc   Get hotel by id
//@route  GET /api/hotels/:id
//@access Public

const getSingleHotel = asyncHandler(async (req, res) => {
  const singleHotel = await Hotel.findById(req.params.id)
    .populate("locationId")
    .populate("food")
    .populate("rooms")
    .populate("periods");
  res.status(200).json(singleHotel);
});

//@desc   Get searched hotels
//@route  GET /api/hotels/searched
//@access Public

const getSearchedHotels = asyncHandler(async (req, res) => {
  const { peopleAmount, daysAmount, startDate, locationId } = req.query;

  // const calculatePrice = (start, daysNum, basePrice, pricesArray) => {
  //   let daysArray = [];
  //   const startingDate = new Date(start);

  //   for (let i = 0; i < daysNum; i++) {
  //     let date = new Date();
  //     date.setDate(startingDate.getDate() + i);
  //     daysArray.push(date);
  //   }

  //   let sum = 0;

  //   const findPriceByDate = (date) => {
  //     if (pricesArray && pricesArray.length > 0) {
  //       pricesArray.forEach((el) => {
  //         if (
  //           date.getMonth() + 1 >= el.dateStart.month &&
  //           date.getMonth() + 1 <= el.dateEnd.month &&
  //           date.getDate() >= el.dateStart.day &&
  //           date.getDate() <= el.dateEnd.day &&
  //           el.price
  //         ) {
  //           sum += el.price;
  //         } else {
  //           sum += basePrice;
  //         }
  //       });
  //     } else {
  //       sum += basePrice;
  //     }
  //     return;
  //   };

  //   for (let i = 0; i < daysNum; i++) {
  //     findPriceByDate(daysArray[i]);
  //   }

  //   return sum;
  // };

  // let costArray = [];

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

  // const updatedHotels = hotels.map((plainHotel) => {
  //   const hotel = plainHotel.toObject();
  //   const rooms = hotel.rooms.filter((room) => room.capacity >= peopleAmount);

  //   const cheapestRoom = rooms.reduce((prev, curr) =>
  //     prev.roomPrice < curr.roomPrice ? prev : curr
  //   );

  //   const basePrice = cheapestRoom.roomPrice;
  //   const pricesArray = cheapestRoom.prices;

  //   const costOfStay = calculatePrice(
  //     startDate,
  //     daysAmount,
  //     basePrice,
  //     pricesArray
  //   );

  //   if (cheapestRoom.discount && cheapestRoom.discount !== 0) {
  //     hotel.totalPrice = (costOfStay * (100 - cheapestRoom.discount)) / 100;
  //     hotel.oldPrice = costOfStay;
  //   } else {
  //     hotel.totalPrice = costOfStay;
  //   }

  //   return hotel;
  // });

  res.status(200).send(hotels);
});

const insertPrices = asyncHandler(async (req, res) => {
  let totalRecords = [];
  // res.send(req.file.path);
  try {
    fs.createReadStream(req.file.path)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => console.error(error))
      .on("data", (row) => {
        totalRecords.push(row);
      })
      .on("end", async (rowCount) => {
        try {
          // create an array of roomIds
          const roomsArray = [
            ...new Set(totalRecords.map((obj) => obj.roomId)),
          ];
          // for each roomId, update a document
          for (const roomId of roomsArray) {
            // filter out only relevant records by roomId
            const relRecords = totalRecords.filter(
              (record) => record.roomId === roomId
            );
            // delete roomId field
            const newRecords = relRecords.map((obj) => {
              const { roomId, ...rest } = obj;
              return rest;
            });
            // update a Room doc
            try {
              const result = await Room.findByIdAndUpdate(
                roomId,
                { prices: newRecords },
                { new: true }
              );
            } catch (error) {
              res.sendStatus(400);
            }
          }
          res.status(200).send(totalRecords);
        } catch (err) {
          res.status(400).json({ error: err.message });
        }
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
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
  insertPrices,
  updateHotelPeriods,
  deletePeriod,
  //test
  getRoomPrices,
  getRoomsByLimit,
  getByTagRecommendation,
};
