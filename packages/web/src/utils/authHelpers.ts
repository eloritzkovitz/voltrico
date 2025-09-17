import Cookies from "js-cookie";
import { IUser as User } from "@shared/interfaces/IUser";

// Set authentication tokens
export function setAuthTokens(accessToken: string, refreshToken: string) {
  Cookies.set("accessToken", accessToken, { expires: 7 });
  Cookies.set("refreshToken", refreshToken, { expires: 7 });
}

// Remove authentication tokens
export function removeAuthTokens() {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
}

// Get authentication tokens
export function getAccessToken(): string | undefined {
  return Cookies.get("accessToken");
}

// Get refresh token
export function getRefreshToken(): string | undefined {
  return Cookies.get("refreshToken");
}

// Check if user is admin
export function isAdmin(user: User | null): boolean {
  return !!user && user.role === "admin";
}