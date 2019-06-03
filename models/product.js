const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  description: String,
  list_image: [String],
  name: String,
  price: Number,
  status: Number,
  number_product:Number,
  categories:[{
    type:Schema.Types.ObjectId, ref: "Category"
  }],
  updated: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", ProductSchema);
