const mongoose = require("mongoose");

const periodSchema = mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    startDay: {
      type: Number,
      required: true,
    },
    startMonth: {
      type: Number,
      required: true,
    },
    endDay: {
      type: Number,
      required: true,
    },
    endMonth: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("Period", periodSchema);
