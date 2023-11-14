const mongoose = require("mongoose");
const idCounterSchema = new mongoose.Schema({
  model: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
  },
});
module.exports = mongoose.model("idCounter", idCounterSchema);
