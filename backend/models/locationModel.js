const mongoose = require("mongoose");

const locationSchema = mongoose.Schema(
  {
    label: String,
    value: String,
    locationName: {
      type: String,
    },
    locationCountry: {
      type: String,
    },
    value: String,
    label: String,
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("Location", locationSchema);
