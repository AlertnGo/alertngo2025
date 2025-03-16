require("dotenv").config();
import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";

const app = express();

// Middleware
app.use(json());
app.use(cors());

// Connect to MongoDB
connect(process.env.MONGO_URI)
  .then(() => console.log("----------------MongoDB Connected---------------"))
  .catch((err) => console.error(err));

// Routes
app.use("/users", require("./routes/userRoutes").default);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
