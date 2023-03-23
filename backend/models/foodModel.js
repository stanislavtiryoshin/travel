const mongoose = require("mongoose");

const foodSchema = mongoose.Schema(
  {
    foodName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("Food", foodSchema);
