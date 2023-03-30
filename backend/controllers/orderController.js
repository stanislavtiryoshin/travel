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
  const post = await Order.create({
    hotel: req.body.hotel,
    daysAmount: req.body.daysAmount,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    sum: req.body.sum,
    peopleAmount: req.body.peopleAmount,
    room: req.body.room,
    clientName: req.body.clientName,
    clientEmail: req.body.clientEmail,
    clientPhone: req.body.clientPhone,
    clientOtherPhone: req.body.clientOtherPhone,
    extraInfo: req.body.extraInfo,
    excursions: req.body.excursions,
  });
  res.status(200).json(post);
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
  const order = await Order.findById(req.params.id);

  // if (!order) {
  //   res.status(400);
  //   throw new Error("Order not found");
  // }

  // // Check if user exists
  // if (!req.user) {
  //   res.status(401);
  //   throw new Error("User not found");
  // }

  // // Check if user is logged in
  // if (order.user.toString() !== req.user.id) {
  //   res.status(401);
  //   throw new Error("User not authorized");
  // }

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
