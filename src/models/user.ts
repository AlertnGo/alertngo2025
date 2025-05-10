import mongoose, { Document, Schema } from "mongoose";

export interface Car {
  brand: string;
  model: string;
  year: number;
  phone: string;
}

export interface UserType extends Document {
  name: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  gender: string;
  profilePicture: string;
  defaultPhone: string;
  isVerified: boolean;
  isActive: boolean;
  isDeleted: boolean;
  cars: Car[];
  createdAt: Date;
  updatedAt: Date;
}

const CarSchema: Schema = new Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  phone: { type: String, required: true, unique: true },
  status: { type: String, required: true, default: "PENDING" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  images: { type: String, default: "" },
});

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  profilePicture: { type: String, required: true, default: "" },
  defaultPhone: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  cars: [CarSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model<UserType>("User", UserSchema);
export { User };
export default User;
