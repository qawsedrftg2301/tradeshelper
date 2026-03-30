const mongoose = require("mongoose")

const ContractorSchema = new mongoose.Schema({
  name: String,
  trade: String,
  city: String,
  phone: String
})

module.exports = mongoose.model("Contractor", ContractorSchema)
