const { Schema, model } = require("mongoose");

const tourSchema = Schema({
  name: {
    type: String,
  },
  tourServices: [
    {
      type: Schema.Types.ObjectId,
      ref: "HotelService",
    },
  ],
  periodPrices: [
    {
      period: {
        type: Schema.Types.ObjectId,
        ref: "Periods",
      },
      adultPrice: Number,
      kidPrice: Number,
    },
  ],
  locationId: {
    type: Schema.Types.ObjectId,
    ref: "Location",
  },
  locationFeature: {
    type: String,
  },
  departureCity: {
    type: String,
  },
  mapLink: {
    type: String,
  },
  rating: {
    type: Number,
    default: 0,
  },
  price: [
    {
      startDay: Number,
      startMonth: Number,
      endDay: Number,
      endMonth: Number,

      kidPrice: Number,
      adultPrice: Number,
    },
  ],
  program: [
    {
      day: Number,
      points: [{ time: String, pointName: String, pointDescription: String }],
    },
  ],
  ratingVotes: {
    type: Number,
  },
  description: {
    type: String,
  },
  duration: {
    type: Number,
  },
  rooms: [
    {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
  ],
  kids: {
    withKids: Boolean,
    babyMaxAge: {
      type: Number,
    },
    kidMaxAge: {
      type: Number,
    },
    kidDiscount: {
      discountType: {
        type: String,
      },
      discountValue: {
        type: Number,
      },
    },
  },
  payment: {
    paymentType: {
      type: String,
    },
    prepayment: {
      type: Number,
    },
  },
  hotelId: [
    {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
    },
  ],
  hotels: [
    {
      hotel: {
        type: Schema.Types.ObjectId,
        ref: "Hotel",
      },
      room: {
        type: Schema.Types.ObjectId,
        ref: "Room",
      },
    },
  ],
  tourServices: [
    {
      type: Schema.Types.ObjectId,
      ref: "HotelService",
    },
  ],
  food: [
    {
      type: Schema.Types.ObjectId,
      ref: "Food",
    },
  ],
  searchable: {
    type: Boolean,
    default: true,
  },
  comforts: [
    {
      name: String,
      // priority: Number,
    },
  ],
  img: [String],
});

module.exports = new model("Tour", tourSchema);
