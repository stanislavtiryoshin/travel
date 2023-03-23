const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    sum: {
      type: Number,
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "В обработке",
    },
    
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("Order", orderSchema);
