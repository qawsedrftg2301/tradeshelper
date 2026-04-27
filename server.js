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

// MongoDB connection with better error handling
const mongoUrl = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/tradeshelper"

mongoose.connect(mongoUrl, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
})
.catch(err => {
  console.error('MongoDB connection error:', err)
})

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err)
})

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB')
})

app.use("/api/auth", authRoutes)
app.use("/api/contractors", contractorRoutes)
app.use("/api/admin", adminRoutes)

// Add a health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  })
})

if (require.main === module) {
  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`TradesHelper running on port ${port}`)
  })
}

module.exports = app
