const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/user");

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

module.exports = router;
//
