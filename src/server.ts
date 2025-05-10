import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import carRoutes from "./routes/carRoutes";

dotenv.config();

const app: Express = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("----------------MongoDB Connected---------------"))
  .catch((err) => console.error(err));

// Routes
app.use("/users", userRoutes);
app.use("/cars", carRoutes);

const PORT: number = parseInt(process.env.PORT || "9000", 10);
app.listen(PORT, () => console.log(`Server est en route sur le port ${PORT}`));
