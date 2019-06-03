const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PromotionSchema = new Schema({
  name:String,
  code:String,
  content:String,
  startTime:{ type: Date, default: Date.now },
  endTime:{ type: Date, default: Date.now },
  status:Number,
  value:Number,
  limit_per_user:{ type: Number, default: 1 },
  number:Number,
  updated: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Promotion", PromotionSchema);
