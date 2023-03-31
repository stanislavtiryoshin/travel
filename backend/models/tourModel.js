const { Schema, model } = require("mongoose");

const tourSchema = Schema({
  name: {
    type: String,
  },
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
  description: {
    type: String,
  },
  duration: {
    type: String,
  },
  rooms: [
    {
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
      prices: [
        {
          dateStart: {
            day: {
              type: Number,
            },
            month: {
              type: Number,
            },
          },
          dateEnd: {
            day: {
              type: Number,
            },
            month: {
              type: Number,
            },
          },
          price: {
            type: Number,
          },
        },
      ],
      roomDescription: {
        type: Number,
      },
      roomServices: [
        {
          serviceId: {
            type: mongoose.Schema.Types.ObjectId,
          },
        },
      ],
    },
  ],
  tourProgram: {
    programId: {
      type: Schema.Types.ObjectId,
    },
  },
});

module.exports = new model("Tour", tourSchema);
