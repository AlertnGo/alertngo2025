const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/user");

// Create a new user
router.post("/", async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a car to a user
router.post("/:userId/cars", async (req, res) => {
  try {
    const { userId } = req.params;
    const { brand, model, year, phone } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if phone number is already used
    const phoneExists = await User.findOne({ "cars.phone": phone });
    if (phoneExists)
      return res.status(400).json({ error: "Phone number already in use" });

    user.cars.push({ brand, model, year, phone });
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a user's cars
router.get("/:userId/cars", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
