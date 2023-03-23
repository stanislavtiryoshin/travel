const mongoose = require("mongoose");

const hotelServiceSchema = mongoose.Schema(
  {
    hotelServiceName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("HotelService", hotelServiceSchema);
