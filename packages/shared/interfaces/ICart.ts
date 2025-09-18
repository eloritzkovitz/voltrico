import { ICartItem } from './ICartItem.js';

export interface ICart {
  _id?: string;
  userId?: string;
  sessionId?: string;
  items: ICartItem[];  
  couponCode?: string;
  total?: number;
  createdAt?: Date;
  updatedAt?: Date;
}