const { Schema, model } = require("mongoose");

const campSchema = Schema({
  name: String,
  locationId: {
    type: Schema.Types.ObjectId,
    ref: "Location",
  },
  locationFeature: {
    type: String,
  },
  mapLink: {
    type: String,
  },
  description: String,
  rating: {
    type: Number,
    default: 0,
  },
  campProgram: {
    programId: {
      type: Schema.Types.ObjectId,
    },
  },
});

module.exports = new model("Camp", campSchema);
