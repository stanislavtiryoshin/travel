const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Add a name"],
    },
    email: {
      type: String,
      required: [true, "Add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Add a password"],
    },
    trackedCoins: [
      {
        coinId: {
          type: String,
        },
      },
    ],
    boughtCoins: [
      {
        coinId: {
          type: String,
        },
        priceBought: {
          type: Number,
        },
        amount: {
          type: Number,
        },
        value: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("User", userSchema);
