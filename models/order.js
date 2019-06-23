const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({

  note:String,
  address: String,
  is_pick_at_store: Boolean,
  customer:{
    type:Schema.Types.ObjectId, ref: "Customer"
  },
  promotion:{
    type:Schema.Types.ObjectId, ref: "Promotion"
  },
  receiver_name: String, 
  receiver_phone: String,
  receiver_address: String,
  products: [{
    number_product: Number,
    product: {
      type:Schema.Types.ObjectId, ref: "Product"
    }
  }],
  subFee: Number,
  text:String,
  channelSelect:String,
  status: String,
  totalAmount: Number,
  code:String,
  updated: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
