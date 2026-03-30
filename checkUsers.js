const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/tradeshelper").then(async () => {
  const users = await User.find({}, "email");
  if (users.length > 0) {
    console.log("Users in database:");
    users.forEach(u => console.log(u.email));
  } else {
    console.log("No users found.");
  }
  mongoose.disconnect();
});
