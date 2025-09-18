import type { IProduct } from "./IProduct.js";

export interface ICartItem extends IProduct {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}