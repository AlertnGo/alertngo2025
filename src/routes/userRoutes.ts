import express, { RequestHandler } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";

const router = express.Router();

// Create a new user
const createUser: RequestHandler = async (req, res): Promise<void> => {
  if (
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.email ||
    !req.body.password ||
    !req.body.defaultPhone
  ) {
    res.status(400).json({ error: "il manque des champs" });
    return;
  }
  const userExite = await User.findOne({
    email: req.body.email,
  });
  if (userExite) {
    res.status(400).json({ error: "User deja existant" });
    return;
  }
  try {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
      defaultPhone: req.body.defaultPhone,
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Login
const login: RequestHandler = async (req, res): Promise<void> => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ error: "email ou mot de passe incorrect" });
    return;
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401).json({ error: "email ou mot de passe incorrect" });
    return;
  }
  res.json(user);
};

// Get all users
const getUsers: RequestHandler = async (req, res): Promise<void> => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get user by id
const getUserById: RequestHandler = async (req, res): Promise<void> => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(user);
};

// Update user by id
const updateUserById: RequestHandler = async (req, res): Promise<void> => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, req.body, { new: true });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(user);
};

router.get("/all", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);
router.post("/signup", createUser);
router.post("/login", login);

export default router;
