import type { Product } from "@/types/product";

export interface Order {
  id?: string;
  orderId: string;
  customerId: string;
  productId: string;
  date: string;
  product: Product;
}