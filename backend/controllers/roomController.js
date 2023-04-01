const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Room = require("../models/roomModel");

//@desc   Get all rooms
//@route  GET /api/rooms
//@access Public

const getRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find();

  res.status(200).send(rooms);
});

//@desc   Add new room
//@route  POST /api/rooms
//@access Private

const addRoom = asyncHandler(async (req, res) => {
  const room = await Room.create(req.body);

  res.status(200).send(room);
});

module.exports = {
  getRooms,
  addRoom,
};
