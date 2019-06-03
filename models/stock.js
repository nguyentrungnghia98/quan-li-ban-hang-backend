const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StockSchema = new Schema({
  name:String,
  provider_name:String,
  products: [{
    type:Schema.Types.ObjectId, ref: "Product"
  }],
  total_items: Number,
  status:Number,
  updated: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Stock", StockSchema);
