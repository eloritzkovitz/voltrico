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

// Google sign in
const signInWithGoogle = (idToken: string) => {
  const abortController = new AbortController();
  const request = apiClient.post<{ accessToken: string, refreshToken: string }>('/auth/google', { idToken }, {
    signal: abortController.signal
  });
  return { request, abort: () => abortController.abort() };
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

// Get current user data
const getUserData = async (): Promise<User> => {
  const token = Cookies.get("accessToken");
  if (!token) throw new Error("No access token found.");
  const response = await apiClient.get<User>("/users/me", {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
}

// Get users by name (search)
const getUsersByName = async (query: string): Promise<User[]> => {
  const token = Cookies.get("accessToken");
  if (!token) throw new Error("No access token found.");
  const response = await apiClient.get<User[]>('/users', {
    headers: { 'Authorization': `Bearer ${token}` },
    params: { query }
  });
  return response.data;
}

// Update current user data
const updateUser = async (formData: FormData): Promise<User> => {
  const token = Cookies.get("accessToken");
  if (!token) throw new Error("No access token found.");
  const response = await apiClient.put<User>("/users/me", formData, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
}

// Delete current user
const deleteUser = async (): Promise<{ message: string }> => {
  const token = Cookies.get("accessToken");
  if (!token) throw new Error("No access token found.");
  const response = await apiClient.delete<{ message: string }>("/users/me", {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
}

export default { signInWithGoogle, register, login,  getUserData, getUsersByName, updateUser, deleteUser };