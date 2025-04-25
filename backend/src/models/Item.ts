import mongoose, { Schema, Document } from "mongoose";
import { IPurchase } from "./Purchase";

export interface IItem extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  weight?: string;
  madeIn?: string;
  color?: string;
  distributor?: string;
  quality?: string;
  img?: string;
  purchases: IPurchase["_id"][];
}

const itemSchema = new Schema<IItem>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  weight: { type: String },
  madeIn: { type: String },
  color: { type: String },
  distributor: { type: String },
  quality: { type: String },
  img: { type: String },
  purchases: [{ type: Schema.Types.ObjectId, ref: "Purchase" }],
});

const ItemModel = mongoose.model<IItem>("Item", itemSchema);

export default ItemModel;