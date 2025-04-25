import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

export interface IPurchase extends Document {
  purchaseId: string;
  customerId: IUser["_id"];
  itemId: mongoose.Schema.Types.ObjectId;
  date: Date;
}

const purchaseSchema = new Schema<IPurchase>({
  purchaseId: { type: String, required: true, unique: true },
  customerId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  itemId: { type: Schema.Types.ObjectId, ref: "Item", required: true },
  date: { type: Date, default: Date.now },
});

const PurchaseModel = mongoose.model<IPurchase>("Purchase", purchaseSchema);

export default PurchaseModel;