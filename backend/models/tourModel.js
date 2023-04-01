const { Schema, model } = require("mongoose");

const tourSchema = Schema({
  name: {
    type: String,
  },
  locationId: {
    type: Schema.Types.ObjectId,
    ref: "Location",
  },
  locationFeature: {
    type: String,
  },
  departureCity: {
    type: String,
  },
  mapLink: {
    type: String,
  },
  rating: {
    type: Number,
    default: 0,
  },
  days: [
    {
      day: {
        type: Number,
        default: 1,
      },
      pointName: String,
      pointDescription: String,
      time: String,
    },
  ],
  ratingVotes: {
    type: Number,
  },
  description: {
    type: String,
  },
  duration: {
    type: String,
  },
  rooms: [
    {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
  ],
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
  payment: {
    paymentType: {
      type: String,
    },
    prepayment: {
      type: Number,
    },
  },
  hotel: {
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
    },
  },
  comforts: [String],
  // tourProgram: {
  //   programId: {
  //     type: Schema.Types.ObjectId,
  //     ref: "Program",
  //   },
  // },
});

module.exports = new model("Tour", tourSchema);
