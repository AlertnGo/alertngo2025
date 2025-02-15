const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  phone: { type: String, required: true, unique: true }, // One phone per car
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cars: [CarSchema], // Array of cars
});

module.exports = mongoose.model("User", UserSchema);
