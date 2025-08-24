import mongoose, { Schema } from "mongoose";
import { IProduct } from "../interfaces/IProduct";

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  color: { type: String },
  dimensions: { type: String },
  weight: { type: String },
  energyRating: { type: String },
  madeIn: { type: String },
  distributor: { type: String },
  warranty: { type: String },
  quality: { type: String },
  imageURL: { type: String },
  features: [{ type: String }],
});

const ProductModel = mongoose.model<IProduct>("Product", productSchema);

export default ProductModel;