const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Order = require("../models/orderModel");

const nodemailer = require("nodemailer");

//@desc   Add new order
//@route  POST /api/orders
//@access Public

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "stanislav.tiryoshin@gmail.com",
    pass: "1917Kornilov!",
  },
});

const addOrder = asyncHandler(async (req, res) => {
  const post = await Order.create({
    name: req.body.name,
    days: req.body.days,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    sum: req.body.sum,
    amount: req.body.amount,
    room: req.body.room,
    location: req.body.location,
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
};
