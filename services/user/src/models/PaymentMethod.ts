import mongoose from "mongoose";
import { IPaymentMethod } from "../interfaces/IPaymentMethod";

const paymentMethodSchema = new mongoose.Schema<IPaymentMethod>({
  type: { type: String, enum: ["mock-card", "paypal", "other"], required: true },
  providerName: String,
  cardLast4: String,
  expiry: String,
  isDefault: { type: Boolean, default: false },
}, { _id: false });

export default paymentMethodSchema;