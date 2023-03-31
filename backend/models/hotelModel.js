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
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
    },
    kidFoodPrice: {
      type: Number,
    },
    adultFoodPrice: {
      type: Number,
    },
    kids: {
      babyMaxAge: {
        type: Number,
      },
      kidMaxAge: {
        type: Number,
      },
      kidDiscount: {
        discountType: {
          type: String,
        },
        discountValue: {
          type: Number,
        },
      },
    },
    comforts: [String],
    payment: {
      paymentType: {
        type: String,
      },
      prepayment: {
        type: Number,
      },
    },
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("Hotel", hotelSchema);
