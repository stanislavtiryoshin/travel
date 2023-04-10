const mongoose = require("mongoose");

const periodSchema = mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    periodPrices: [
      {
        startDay: Number,
        startMonth: Number,
        endDay: Number,
        endMonth: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("Period", periodSchema);
