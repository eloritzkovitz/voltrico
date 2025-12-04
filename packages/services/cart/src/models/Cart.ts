import mongoose, { Schema } from "mongoose";
import { ICart } from "@shared/interfaces/ICart.js";
import { ICartItem } from "@shared/interfaces/ICartItem.js";

const cartItemSchema = new Schema<ICartItem>(
  {
    productId: { type: String, required: true },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const cartSchema = new Schema<ICart>({
  userId: { type: String },
  sessionId: { type: String },
  items: { type: [cartItemSchema], default: [] },
  couponCode: { type: String },
  total: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

cartSchema.pre(
  "save" as any,
  function (this: mongoose.Document & ICart, next: (err?: any) => void) {
    this.updatedAt = new Date();
    next();
  }
);

const Cart = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
