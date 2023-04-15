const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    categoryName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("Category", categorySchema);
