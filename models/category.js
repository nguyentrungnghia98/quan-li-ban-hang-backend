const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  description: String,
  name: String,
  status: Number,
  image: String,
  updated: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Category", CategorySchema);
