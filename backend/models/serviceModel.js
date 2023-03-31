const { Schema, model } = require("mongoose");

const serviceSchema = Schema({
  serviceName: {
    type: String,
  },
  description: {
    type: String,
  },
});

module.exports = new model("Service", serviceSchema);
