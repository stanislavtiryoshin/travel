const { Schema, model } = require("mongoose");

const sanatoriumSchema = Schema(
  {
    name: {
      type: String,
    },
    periods: [
      {
        type: Schema.Types.ObjectId,
        ref: "Period",
      },
    ],
    locationId: {
      type: Schema.Types.ObjectId,
      ref: "Location",
    },
    food: {
      foodType: {
        type: Schema.Types.ObjectId,
        ref: "Food",
      },
      description: String,
    },
    sanatoriumServices: [
      {
        serviceType: {
          type: Schema.Types.ObjectId,
          ref: "HotelService",
        },
        description: String,
      },
    ],
    locationFeature: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0,
    },
    ratingVotes: {
      type: Number,
    },
    description: {
      type: String,
    },
    mapLink: {
      type: String,
    },
    enterTime: {
      type: String,
    },
    leaveTime: {
      type: String,
    },
    sanatoriumProgram: {
      programId: {
        type: Schema.Types.ObjectId,
        ref: "Program",
      },
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
    payment: {
      paymentType: {
        type: String,
      },
      prepayment: {
        type: Number,
      },
    },
    rooms: [
      {
        type: Schema.Types.ObjectId,
        ref: "Room",
      },
    ],
    additionalPlaces: {
      maxAdditionalPlaces: Number,
      adultPrice: Number,
      kidPrice: Number,
    },
    img: [String],
  },

  {
    timestamps: true,
  }
);

module.exports = new model("Sanatorium", sanatoriumSchema);
