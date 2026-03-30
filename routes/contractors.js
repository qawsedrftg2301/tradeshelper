const router = require("express").Router();
const User = require("../models/User");

router.get("/search", async (req, res) => {
  const trade = req.query.trade || "";
  const city = req.query.city || "";
  const query = { type: "tradesperson" };
  if (trade) query.services = new RegExp(trade, "i");
  if (city) query.address = new RegExp(city, "i");
  const results = await User.find(query, "name company trade city phone services contacts photo");
  console.log("Tradesperson search results:", results);
  res.json(results);
});

module.exports = router;
