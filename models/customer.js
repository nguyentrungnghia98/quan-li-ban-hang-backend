const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  avatar: String,
  birthday: Date,
  email: String,
  name: String,
  phone: String,
  sex: String,
  status: Number,
  number_of_bill: Number,
  amount_of_purchase: Number,
  last_date_order:Date,
  latest_address: String,
  favorite_address: String,
  latest_bill: {
    type:Schema.Types.ObjectId, ref: "Order"
  },

  updated: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Customer", CustomerSchema);
