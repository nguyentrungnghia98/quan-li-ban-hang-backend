const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  role:String,
  email: { type: String, unique: true, lowercase: true },
  name: String,
  address: String,
  phone: String,
  avatar: String,
  isAccepted: Boolean,
  isDenied: Boolean,
  uid:String,
  updated: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
