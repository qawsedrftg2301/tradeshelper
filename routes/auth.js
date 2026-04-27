const router = require("express").Router()
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const upload = require("../middleware/upload")

const router = require("express").Router()
const bcrypt = require("bcryptjs")
const User = require("../models/User")

router.post("/signup", async (req, res) => {
  try {
    console.log("Signup request body:", req.body)
    
    if (!req.body.email || !req.body.password || !req.body.type) {
      return res.status(400).json({ error: "Email, password, and type are required" })
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email })
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }
    
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
      // Note: File uploads removed for serverless compatibility
    }
    
    const user = new User(userData)
    await user.save()
    console.log("User created successfully:", userData.email)
    res.json({ message: "User created" })
  } catch (error) {
    console.error("Signup error:", error)
    res.status(400).json({ error: error.message || "Signup failed" })
  }
})

router.post("/login", async (req, res) => {
  try {
    console.log("Login request body:", req.body)
    
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ error: "Email and password are required" })
    }
    
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      console.log("User not found:", req.body.email)
      return res.status(400).json({ error: "User not found" })
    }
    
    const valid = await bcrypt.compare(req.body.password, user.password)
    if (!valid) {
      console.log("Invalid password for user:", req.body.email)
      return res.status(400).json({ error: "Wrong password" })
    }
    
    console.log("Login successful for user:", req.body.email)
    res.json({ message: "Login success" })
  } catch (error) {
    console.error("Login error:", error)
    res.status(400).json({ error: error.message || "Login failed" })
  }
})

module.exports = router
