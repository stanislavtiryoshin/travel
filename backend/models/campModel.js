const { Schema, model } = require("mongoose");

const campSchema = Schema({
  name: String,
  locationId: {
    type: Schema.Types.ObjectId,
    ref: "Location",
  },
  periodPrices: [
    {
      minAge: Number,
      maxAge: Number,
      prices: [
        {
          period: {
            type: Schema.Types.ObjectId,
            ref: "Period",
          },
          campPrice: Number,
        },
      ],
    },
  ],
  // food: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "Food",
  //   },
  // ],
  locationFeature: {
    type: String,
  },
  mapLink: {
    type: String,
  },
  description: String,
  kids: {
    forWho: String,
    minCountInGroup: {
      type: Number,
      default: 12,
    },
    maxCountInGroup: {
      type: Number,
      default: 20,
    },
    minAgeInGroup: {
      type: Number,
      default: 2,
    },
    maxAgeInGroup: {
      type: Number,
      default: 14,
    },
  },

  img: [String],
  rating: {
    type: Number,
    default: 0,
  },

  payment: {
    paymentType: {
      type: String,
    },
    prepayment: {
      type: Number,
    },
  },
  hotelName: {
    type: String,
  },
  hotelDescription: {
    type: String,
  },
  program: [
    {
      days: [
        {
          points: {
            day: Number,
            time: String,
            pointName: String,
            pointDescription: String,
          },
        },
      ],
    },
  ],
});

module.exports = new model("Camp", campSchema);
