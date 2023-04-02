const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Room = require("../models/roomModel");
const Hotel = require("../models/hotelModel");

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
  const singleRoom = await Room.findById(req.params.roomId);
  res.status(200).send(singleRoom);
});

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
  const room = await Hotel.findByIdAndUpdate(req.params.roomId, req.body, {
    new: true,
  });
  res.status(200).json(room);
});

module.exports = {
  getRooms,
  addRoom,
  getSingleRoom,
  updateRoom,
};
