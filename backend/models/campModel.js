const { Schema, model } = require("mongoose");

const campSchema = Schema({
  name: String,
  locationId: {
    type: Schema.Types.ObjectId,
    ref: "Location",
  },
  food: {
    type: Schema.Types.ObjectId,
    ref: "Food",
  },
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
  comforts: [String],
  rating: {
    type: Number,
    default: 0,
  },
  ratingVotes: {
    type: Number,
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
  campProgram: {
    programId: {
      type: Schema.Types.ObjectId,
      ref: "Program",
    },
  },
});

module.exports = new model("Camp", campSchema);
