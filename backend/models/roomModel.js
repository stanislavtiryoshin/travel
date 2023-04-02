const mongoose = require("mongoose");

const roomSchema = mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
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
    smokingPolicy: {
      type: String,
    },
    roomsNumber: {
      type: Number,
    },
    beds: {
      bedsType: {
        type: String,
      },
      largeBeds: {
        type: Number,
      },
      smallBeds: Number,
    },
    people: {
      adultMax: {
        type: Number,
      },
      babyMax: {
        type: Number,
      },
      kidsMax: {
        type: Number,
      },
    },
    restroom: {
      type: String,
    },
    bathroom: {
      availablity: {
        type: String,
      },
      type: {
        type: String,
      },
      features: [String],
    },
    comforts: [String],
    comment: {
      type: String,
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
      type: String,
    },
    roomServices: [String],
    bathExtras: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("Room", roomSchema);
