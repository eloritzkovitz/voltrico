// User type
export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;  
  joinDate?: string;  
  refreshToken?: string[];
  purchases?: [{ type: string, ref: 'Purchase' }]
  role?: 'customer' | 'admin';  
}

// Context type for authentication
export interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;  
}