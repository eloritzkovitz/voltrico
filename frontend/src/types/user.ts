export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;  
  profilePicture?: string;
  joinDate?: string;  
  refreshToken?: string[];
  purchases?: [{ type: string, ref: 'Purchase' }]
  role?: 'customer' | 'admin';  
}