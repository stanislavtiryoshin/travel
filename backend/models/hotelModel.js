const mongoose = require("mongoose");

const hotelSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    typeId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    resortId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    mapLink: {
      type: String,
    },
    phone: {
      type: String,
    },
    program: [
      {
        dayNum: { type: Number },
        activities: [
          {
            time: { type: String },
            activity: { type: String },
          },
        ],
      },
    ],
    food: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
    rating: {
      type: Number,
      default: 0,
    },
    ratingVotes: {
      type: Number,
    },
    hotelStars: {
      type: Number,
    },
    description: {
      type: String,
    },
    enterTime: {
      type: String,
    },
    leaveTime: {
      type: String,
    },
    hotelServices: {
      serviceId: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    rooms: [
      {
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
        beds: {
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
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("Hotel", hotelSchema);
