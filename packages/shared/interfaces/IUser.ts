import { IAddress } from "./IAddress.js";
import { IPaymentMethod } from "./IPaymentMethod.js";

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  gender?: string;
  dateOfBirth?: string;
  addresses?: IAddress[];
  paymentMethods?: IPaymentMethod[];
  role: "customer" | "admin";
  emailVerified?: boolean;
  newsletterSubscribed?: boolean;
  refreshToken?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}
