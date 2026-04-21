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

const mongoUrl = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/tradeshelper"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })

app.use("/api/auth", authRoutes)
app.use("/api/contractors", contractorRoutes)
app.use("/api/admin", adminRoutes)

if (require.main === module) {
  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`TradesHelper running on port ${port}`)
  })
}

module.exports = app
