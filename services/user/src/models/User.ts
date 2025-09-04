import mongoose from "mongoose";
import { IUser } from "../interfaces/IUser";

const userSchema = new mongoose.Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },  
  joinDate: { type: String, required: true },  
  refreshToken: { type: [String], default: [] },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
});

const userModel = mongoose.model<IUser>("Users", userSchema);

export default userModel;