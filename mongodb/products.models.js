const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  Product_id: {
    type: Number,
    required: true,
  },
  Product_name: {
    type: String,
  },
  Product_desc: {
    type: String,
  },
  User_name: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  State: {
    type: String,
    default: "FOR_SALE",
  },
});

module.exports = mongoose.model("Products", ProductSchema);
