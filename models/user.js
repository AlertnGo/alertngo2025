import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  defaultPhone: { type: String, required: true, unique: true },
});

export default model("User", UserSchema);
