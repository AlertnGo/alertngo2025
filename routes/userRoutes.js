import { Router } from "express";
import { hash } from "bcrypt";
const router = Router();
import User from "../models/user";

// Create a new user
router.post("/", async (req, res) => {
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.password ||
    !req.body.defaultPhone
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const userExite = await User.findOne({
    email: req.body.email,
  });
  if (userExite) {
    return res.status(400).json({ error: "User already exist" });
  }
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: await hash(req.body.password, 10),
      defaultPhone: req.body.defaultPhone,
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

export default router;
