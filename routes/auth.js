const router = require("express").Router()
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const upload = require("../middleware/upload")

const router = require("express").Router()
const bcrypt = require("bcryptjs")
const User = require("../models/User")

// Test endpoint to check if routes work at all
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes are working", timestamp: new Date().toISOString() })
})

router.post("/signup", async (req, res) => {
  try {
    console.log("Signup request received")
    console.log("Request body:", req.body)
    console.log("MongoDB connection state:", require('mongoose').connection.readyState)
    
    if (!req.body.email || !req.body.password || !req.body.type) {
      console.log("Missing required fields")
      return res.status(400).json({ error: "Email, password, and type are required" })
    }
    
    // Check if user already exists
    console.log("Checking for existing user...")
    const existingUser = await User.findOne({ email: req.body.email })
    if (existingUser) {
      console.log("User already exists")
      return res.status(400).json({ error: "User already exists" })
    }
    
    console.log("Hashing password...")
    const hash = await bcrypt.hash(req.body.password, 10)
    const userData = {
      email: req.body.email,
      password: hash,
      type: req.body.type
    };
    
    if (req.body.type === "customer") {
      userData.name = req.body.name;
      userData.address = req.body.address;
      userData.phone = req.body.phone;
    } else if (req.body.type === "tradesperson") {
      userData.name = req.body.name;
      userData.company = req.body.company;
      userData.trade = req.body.trade;
      userData.city = req.body.city;
      userData.phone = req.body.phone;
      userData.services = req.body.services;
      userData.contacts = req.body.contacts;
    }
    
    console.log("Creating user with data:", { ...userData, password: '[HIDDEN]' })
    const user = new User(userData)
    await user.save()
    console.log("User created successfully")
    res.json({ message: "User created" })
  } catch (error) {
    console.error("Signup error:", error)
    res.status(500).json({ error: error.message || "Signup failed" })
  }
})

router.post("/login", async (req, res) => {
  try {
    console.log("Login request received")
    console.log("Request body:", { email: req.body.email, password: '[HIDDEN]' })
    console.log("MongoDB connection state:", require('mongoose').connection.readyState)
    
    if (!req.body.email || !req.body.password) {
      console.log("Missing email or password")
      return res.status(400).json({ error: "Email and password are required" })
    }
    
    console.log("Looking for user...")
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      console.log("User not found:", req.body.email)
      return res.status(400).json({ error: "User not found" })
    }
    
    console.log("Comparing passwords...")
    const valid = await bcrypt.compare(req.body.password, user.password)
    if (!valid) {
      console.log("Invalid password for user:", req.body.email)
      return res.status(400).json({ error: "Wrong password" })
    }
    
    console.log("Login successful for user:", req.body.email)
    res.json({ message: "Login success" })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: error.message || "Login failed" })
  }
})

module.exports = router
