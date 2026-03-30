const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const authRoutes = require("./routes/auth")
const contractorRoutes = require("./routes/contractors")
const adminRoutes = require("./routes/admin")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

mongoose.connect("mongodb://127.0.0.1:27017/tradeshelper")

app.use("/api/auth", authRoutes)
app.use("/api/contractors", contractorRoutes)
app.use("/api/admin", adminRoutes)

app.listen(3000, () => {
  console.log("TradesHelper running on port 3000")
})
