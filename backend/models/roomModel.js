const mongoose = require("mongoose");

const roomSchema = mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
    roomName: {
      type: String,
    },
    roomType: {
      type: String,
    },
    capacity: {
      type: Number,
    },
    extraPlace: {
      type: Number,
    },
    roomPrice: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    area: {
      type: Number,
    },
    prices: [
      {
        dateStart: {
          day: {
            type: Number,
          },
          month: {
            type: Number,
          },
        },
        dateEnd: {
          day: {
            type: Number,
          },
          month: {
            type: Number,
          },
        },
        price: {
          type: Number,
        },
      },
    ],
    roomDescription: {
      type: Number,
    },
    roomServices: [
      {
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "RoomService",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("Room", roomSchema);
