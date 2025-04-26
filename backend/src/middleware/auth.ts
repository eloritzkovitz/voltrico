import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type Payload = {
  _id: string;
  role: string; // Include the user's role in the payload type
};

// Middleware to check if the user is authenticated
export const authMiddleware = (
  req: Request & { user?: Payload }, // Add `user` to the request type
  res: Response,
  next: NextFunction
) => {
  const authorization = req.header("authorization");
  const token = authorization && authorization.split(" ")[1];

  if (!token) {
    res.status(401).send("Access Denied");
    return;
  }
  if (!process.env.TOKEN_SECRET) {
    res.status(500).send("Server Error");
    return;
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
    if (err) {
      res.status(401).send("Access Denied");
      return;
    }

    // Attach the user object to the request
    req.user = payload as Payload;

    next();
  });
};

// Middleware to check if the user is an administrator
export const checkAdminRole = (
  req: Request & { user?: { _id: string; role: string } },
  res: Response,
  next: NextFunction
): void => {
  if (req.user && req.user.role === "administrator") {    
    next();
  } else {    
    res.status(403).json({ message: "Unauthorized" });
  }
};