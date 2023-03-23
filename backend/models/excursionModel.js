const mongoose = require("mongoose");

const excursionSchema = mongoose.Schema(
  {
    excursionName: {
      type: String,
    },
    excursionLocation: {
      type: String,
    },
    excursionDescription: {
      type: String,
    },
    excursionPrice: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("Excursion", excursionSchema);
