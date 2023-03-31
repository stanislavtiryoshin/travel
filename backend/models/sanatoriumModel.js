const { Schema, model } = require("mongoose");

const sanatoriumSchema = Schema(
  {
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
    rating: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
    },
    mapLink: {
      type: String,
    },
    enterTime: {
      type: String,
    },
    leaveTime: {
      type: String,
    },
    sanatoriumProgram: {
      programId: {
        type: Schema.Types.ObjectId,
      },
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
  },
  {
    timestamps: true,
  }
);

module.exports = new model("Sanatorium", sanatoriumSchema);
