import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

export interface IOrder extends Document {
  orderId: string;
  customerId: IUser["_id"];
  itemId: mongoose.Schema.Types.ObjectId;
  date: Date;
}

const orderSchema = new Schema<IOrder>({
  orderId: { type: String, required: true, unique: true },
  customerId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  itemId: { type: Schema.Types.ObjectId, ref: "Item", required: true },
  date: { type: Date, default: Date.now },
});

const OrderModel = mongoose.model<IOrder>("Order", orderSchema);

export default OrderModel;