import { Request } from "express";
import { getUserRole } from "@eloritzkovitz/server-essentials"

/**
 * Formats a user object for API responses, excluding sensitive fields.
 * @param user - The user object from the database.
 * @returns An object containing only safe, public user fields.
 */
export function userResponse(user: any) {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    address: user.address,
  };
}

/**
 * Checks if the current user is authorized to perform actions on the given userId.
 * @param req - The Express request object, with authenticated user info.
 * @param userId - The target user's ID.
 * @returns True if authorized (self or admin), false otherwise.
 */
export function isAuthorized(req: Request & { user?: { _id: string; role: string } }, userId: string): boolean {
  return req.user?._id === userId || getUserRole(req) === "admin";
}
