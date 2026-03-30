const router = require("express").Router();
const User = require("../models/User");
const mongoose = require("mongoose");

router.get("/users", async (req, res) => {
  const users = await User.find({}, "email type name address phone company services contacts");
  res.json(users);
});

router.delete("/users/:id", async (req, res) => {
  try {
    console.log("Attempting to delete user with id:", req.params.id);
    const result = await User.findByIdAndDelete(req.params.id);
    if (result) {
      console.log("User deleted:", result.email);
      res.json({ message: "User deleted" });
    } else {
      console.log("User not found for deletion");
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

router.put("/users/:id", async (req, res) => {
  const update = {};
  if (req.body.email) update.email = req.body.email;
  // Add more fields as needed for full edit support
  await User.findByIdAndUpdate(req.params.id, update);
  res.json({ message: "User updated" });
});

module.exports = router;
