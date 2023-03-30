const mongoose = require("mongoose");

const hotelServiceSchema = mongoose.Schema(
  {
    hotelServiceName: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("HotelService", hotelServiceSchema);
