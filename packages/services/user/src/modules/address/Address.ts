import mongoose from "mongoose";
import { IAddress } from "@shared/interfaces/IAddress.js";

const addressSchema = new mongoose.Schema<IAddress>({
  label: String,
  receiverFirstName: String,
  receiverLastName: String,
  receiverPhone: String,
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: String,
  zip: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
}, { _id: false });

export default addressSchema;