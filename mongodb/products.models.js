const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

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

ProductSchema.plugin(AutoIncrement, { inc_field: "Product_id" });
module.exports = mongoose.model("Products", ProductSchema);
