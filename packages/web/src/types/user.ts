import type { IUser as User } from "@shared/interfaces/IUser.js";

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