import apiClient, { CanceledError } from "./api-client";
import Cookies from "js-cookie";

export { CanceledError }

// User interface
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

// Register a new user
const register = (user: User) => {
    const abortController = new AbortController();
    const request = apiClient.post<User>('/auth/register', user, {
        headers: {
            'Content-Type': 'application/json'
        },
        signal: abortController.signal
    });
    return { request, abort: () => abortController.abort() };
}

// Login
const login = (email: string, password: string) => {
    const abortController = new AbortController();
    const request = apiClient.post<{ accessToken: string, refreshToken: string }>('/auth/login',
        { email, password },
        { signal: abortController.signal });
    return { request, abort: () => abortController.abort() };
}

// Get user data
const getUserData = async (id?: string): Promise<User> => {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("No access token found.");
    }
        
    const endpoint = "/auth/user";

    const response = await apiClient.get<User>(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
};

// Get user by name
const getUsersByName = async (query: string): Promise<User[]> => {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("No access token found.");
    }
    const response = await apiClient.get<User[]>('/auth/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: { query }
    });
    return response.data;
}

// Update user data
const updateUser = async (id: string, formData: FormData): Promise<User> => {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("No access token found.");
    }
    const response = await apiClient.put<User>(`/auth/user/${id}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
};

// Google sign in
const signInWithGoogle = (idToken: string) => {
    const abortController = new AbortController();
    const request = apiClient.post<{ accessToken: string, refreshToken: string }>('/auth/google', { idToken }, {
        signal: abortController.signal
    });
    return { request, abort: () => abortController.abort() };
}

export default { register, login, signInWithGoogle, getUserData, getUsersByName, updateUser };