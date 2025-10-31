import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
  userRole?: string;
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

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      sub: string;
      email: string;
      role?: string;
    };
    
    req.userId = payload.sub;
    req.userEmail = payload.email;
    req.userRole = payload.role;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // First check auth
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      sub: string;
      email: string;
      role?: string;
    };
    
    const userRole = payload.role;
    
    if (userRole !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    req.userId = payload.sub;
    req.userEmail = payload.email;
    req.userRole = userRole;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

