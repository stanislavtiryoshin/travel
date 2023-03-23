const mongoose = require("mongoose");

const locationSchema = mongoose.Schema(
  {
    locationName: {
      type: String,
    },
    locationCountry: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("Location", locationSchema);
