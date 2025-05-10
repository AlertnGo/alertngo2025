import express, { Request, Response, RequestHandler } from "express";
import bcrypt from "bcrypt";
import User, { UserType } from "../models/user";

const router = express.Router();

// Create a new user
const createUser: RequestHandler = async (req, res): Promise<void> => {
  if (
    !req.body.name ||
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
      name: req.body.name,
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

// Get all users
const getUsers: RequestHandler = async (req, res): Promise<void> => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
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

router.post("/", createUser);
router.get("/", getUsers);
router.post("/login", login);

export default router;
