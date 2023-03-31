const { Schema, model } = require("mongoose");

const sanatoriumServiceSchema = Schema(
  {
    sanatoriumServiceName: {
      type: String,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("SanatoriumService", sanatoriumServiceSchema);
