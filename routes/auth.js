const router = require("express").Router()
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const upload = require("../middleware/upload")

router.post("/signup", upload.single("photo"), async (req, res) => {
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
    if (req.file) {
      userData.photo = "/uploads/" + req.file.filename;
    }
  }
  const user = new User(userData)
  await user.save()
  res.json({ message: "User created" })
})

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.json({ error: "User not found" })
  const valid = await bcrypt.compare(req.body.password, user.password)
  if (!valid) return res.json({ error: "Wrong password" })
  res.json({ message: "Login success" })
})

module.exports = router
