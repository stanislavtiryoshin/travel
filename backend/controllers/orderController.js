const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const nodemailer = require("nodemailer");

//@desc   Add new order
//@route  POST /api/orders
//@access Public

const addOrder = asyncHandler(async (req, res) => {
  const order = await Order.create(req.body);
  res.status(200).json(order);
});

//@desc   Get all orders
//@route  GET /api/orders
//@access Public

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  res.status(200).json(orders);
});

const getSingleOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId)
    .populate({ path: "hotel", select: "name" })
    .populate("location")
    .populate({ path: "hotelRoom", select: "rooms.roomName" });
  res.status(200).json(order);
});

//@desc   Update status
//@route  PATCH /api/orders
//@access Private

const updateOrder = asyncHandler(async (req, res) => {
  // res.send(req.params.id);
  // const order = await Order.findById(req.params.id);
  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.status(200).json(updatedOrder);
});

module.exports = {
  getOrders,
  addOrder,
  updateOrder,
  getSingleOrder,
};
