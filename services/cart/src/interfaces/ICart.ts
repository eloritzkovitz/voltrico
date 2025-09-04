import { ICartItem } from './ICartItem';

export interface ICart {
  _id?: string;
  userId?: string;
  sessionId?: string;
  items: ICartItem[];
  createdAt?: string;
  updatedAt?: string;
  couponCode?: string;
  total?: number;
}