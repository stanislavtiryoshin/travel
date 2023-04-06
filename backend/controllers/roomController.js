const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Room = require("../models/roomModel");
const { Hotel } = require("../models/hotelModel");
const { Period } = require("../models/hotelModel");
const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");

//@desc   Get all rooms
//@route  GET /api/rooms
//@access Public

const getRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find();
  res.status(200).send(rooms);
});

//@desc   Get single room by id
//@route  GET /api/rooms/:roomId
//@access Private

const getSingleRoom = asyncHandler(async (req, res) => {
  const singleRoom = await Room.findById(req.params.roomId)
    .populate("hotel")
    .populate({
      path: "periodPrices.periodId",
      model: "Period",
      select: "-_id startDay startMonth endDay endMonth",
    });
  res.status(200).send(singleRoom);
});

// const addRoomPrices = asyncHandler(async (req,res) => {
//   const updatedRoom = await Room.findByIdAndUpdate(req.params.roomId, ).
// })

//@desc   Add new room
//@route  POST /api/rooms
//@access Private

const addRoom = asyncHandler(async (req, res) => {
  const room = await Room.create(req.body);
  await Hotel.findByIdAndUpdate(
    room.hotel,
    { $push: { rooms: room._id } },
    { new: true }
  );
  res.status(200).send(room);
});

//@desc   Update room
//@route  PATCH /api/rooms/:roomId
//@access Private

const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.roomId, req.body, {
    new: true,
  });
  res.status(200).json(room);
});

//@desc   Insert prices
//@route  PATCH /api/rooms/:roomId/prices
//@access Private

const insertPrices2 = asyncHandler(async (req, res) => {
  let totalRecords = [];

  const parser = parse({ columns: true }, function (err, records) {
    records.forEach((record) => totalRecords.push(record));
  });

  fs.createReadStream(__dirname + "/addresses.csv")
    .pipe(parser)
    .on("data", (row) => totalRecords.push(row))
    .on("end", async (rowCount) => {
      try {
        const room = await Room.findByIdAndUpdate(
          req.params.roomId,
          {
            prices: totalRecords,
          },
          { new: true }
        );

        res.status(200).json(room);
      } catch (err) {
        res.status(400).json(err);
      }
    });
});

const insertPrices = asyncHandler(async (req, res) => {
  let totalRecords = [];
  try {
    fs.createReadStream(__dirname + "/addresses.csv")
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => console.error(error))
      .on("data", (row) => {
        totalRecords.push(row);
      })
      .on("end", async (rowCount) => {
        try {
          console.log(totalRecords);
          const room = await Room.findByIdAndUpdate(
            req.params.roomId,
            { prices: totalRecords },
            { new: true }
          );

          res.json(room);
        } catch (err) {
          res.status(400).json(err);
        }
      });
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = {
  getRooms,
  addRoom,
  getSingleRoom,
  updateRoom,
  insertPrices,
};
