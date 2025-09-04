import mongoose from "mongoose";
import { IUser } from "../interfaces/IUser";
import addressSchema from "./Address";
import paymentMethodSchema from "./PaymentMethod";

const userSchema = new mongoose.Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  gender: { type: String },
  dateOfBirth: { type: String },
  addresses: { type: [addressSchema], default: [] },
  paymentMethods: { type: [paymentMethodSchema], default: [] },  
  refreshToken: { type: [String], default: [] },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  emailVerified: { type: Boolean, default: false },
  newsletterSubscribed: { type: Boolean, default: false },
  createdAt: { type: String },
  updatedAt: { type: String },
  lastLogin: { type: String },
}, { timestamps: true });

const userModel = mongoose.model<IUser>("Users", userSchema);

export default userModel;