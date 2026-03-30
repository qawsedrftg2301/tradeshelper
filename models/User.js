const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  type: String, // 'customer' or 'tradesperson'
  // Customer fields
  name: String,
  address: String,
  phone: String,
  // Tradesperson fields
  company: String,
  trade: String,
  city: String,
  services: String,
  contacts: String,
  photo: String // path to uploaded photo
})

module.exports = mongoose.model("User", UserSchema)
