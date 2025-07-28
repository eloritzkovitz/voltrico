import mongoose, { Schema } from "mongoose";

export interface IProduct {
  name: string;
  brand: string;
  model?: string;
  description: string;
  price: number;
  category: string;
  color?: string;
  dimensions?: string;
  weight?: string;
  energyRating?: string;
  madeIn?: string;
  distributor?: string;
  warranty?: string;
  quality?: string;
  img?: string;
  features?: string[];
}

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
  img: { type: String },
  features: [{ type: String }],
});

const ProductModel = mongoose.model<IProduct>("Product", productSchema);

export default ProductModel;