import express, { Request, Response, Router } from "express";
import User, { UserType, Car } from "../models/user";

const router: Router = express.Router();

interface AddCarRequest {
  brand: string;
  model: string;
  year: number;
  phone: string;
}

type AddCarHandler = (
  req: Request<{ userId: string }, any, AddCarRequest>,
  res: Response
) => Promise<void>;

// Add a car to a user
const addCar: AddCarHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { brand, model, year, phone } = req.body;

    const user = (await User.findById(userId).exec()) as UserType | null;
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Check if phone number is already used
    const phoneExists = await User.findOne({ "cars.phone": phone }).exec();
    if (phoneExists) {
      res.status(400).json({ error: "Phone number already in use" });
      return;
    }

    const car: Car = { brand, model, year, phone };
    user.cars.push(car);
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

router.post("/:userId/cars", addCar);

export default router;
//
