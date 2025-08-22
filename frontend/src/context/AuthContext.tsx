"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import userService from "@/services/user-service";
import type { User, AuthContextType } from "@/types/user";
import { setAuthTokens, removeAuthTokens, getAccessToken, isAdmin as isAdminHelper } from "@/utils/authHelpers";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      userService
        .getUserData()
        .then((fetchedUser) => {          
          setUser(fetchedUser);
          setIsAuthenticated(true);
          setIsAdmin(isAdminHelper(fetchedUser));
        })
        .catch(() => {
          setIsAuthenticated(false);
          setIsAdmin(false);
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Authenticate user on login
  const login = (accessToken: string, refreshToken: string) => {
    setAuthTokens(accessToken, refreshToken);
    setIsAuthenticated(true);
    userService.getUserData().then((fetchedUser) => {
      setUser(fetchedUser);
      setIsAdmin(isAdminHelper(fetchedUser));
    });
  };

  // Remove authentication on logout
  const logout = () => {
    removeAuthTokens();
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);   
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, user, loading, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
};