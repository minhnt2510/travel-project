import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    // @ts-ignore
    req.userId = payload.sub;
    // @ts-ignore
    req.userEmail = payload.email;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

