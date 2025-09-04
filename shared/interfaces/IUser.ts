export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;  
  joinDate?: string;  
  refreshToken?: string[];
  role: 'customer' | 'admin';
}