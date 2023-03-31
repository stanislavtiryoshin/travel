const { Schema, model } = require("mongoose");

const sanatoriumServiceSchema = Schema(
  {
    sanatoriumServiceName: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("SanatoriumProgram", sanatoriumServiceSchema);
