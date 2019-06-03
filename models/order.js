const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  customer: {
    type:Schema.Types.ObjectId, ref: "Customer"
  },
  note:String,
  address: String,
  is_pick_at_store: Boolean,
  receiver_name: String,
  receiver_phone: String,
  receiver_address: String,
  products: [{
    type:Schema.Types.ObjectId, ref: "Product"
  }],
  status: String,
  updated: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
