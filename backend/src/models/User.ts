import mongoose, { Schema, model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  avatar?: string;
  role: "client" | "staff" | "admin";
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    phone: String,
    avatar: String,
    role: { type: String, enum: ["client", "staff", "admin"], default: "client" },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || model<IUser>("User", userSchema);
