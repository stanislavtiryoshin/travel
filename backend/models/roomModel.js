const mongoose = require("mongoose");

const roomSchema = mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    img: [String],
    periodPrices: [
      {
        periodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Period",
        },
        startDay: Number,
        startMonth: Number,
        endDay: Number,
        endMonth: Number,
        roomPrice: Number,
        adultPrice: Number,
        kidPrice: Number,
      },
    ],
    roomName: {
      type: String,
    },
    roomType: {
      type: String,
    },
    capacity: {
      type: Number,
    },
    extraPlace: {
      type: Number,
    },
    roomPrice: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    area: {
      type: Number,
    },
    smokingPolicy: {
      type: String,
    },
    roomsNumber: {
      type: Number,
    },
    beds: {
      bedsType: {
        type: String,
      },
      largeBeds: {
        type: Number,
      },
      smallBeds: Number,
    },
    people: {
      adultMax: {
        type: Number,
      },
      babyMax: {
        type: Number,
      },
      kidsMax: {
        type: Number,
      },
    },
    restroom: {
      type: String,
    },
    bathroom: {
      availablity: {
        type: String,
      },
      type: {
        type: String,
      },
      features: [String],
    },
    comforts: [String],
    comment: {
      type: String,
    },
    roomDescription: {
      type: String,
    },
    roomServices: [String],
    bathExtras: [String],
  },
  {
    timestamps: true,
  }
);

roomSchema.virtual("periods", {
  ref: "Hotel",
  localField: "hotel",
  foreignField: "_id",
  justOne: true,
  populate: {
    path: "periods",
    select: "startDay startMonth endDay endMonth",
  },
});

module.exports = new mongoose.model("Room", roomSchema);
