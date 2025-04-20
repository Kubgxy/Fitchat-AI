import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "fitchat";

// ✅ เพิ่ม type ให้ Express Request รู้จัก .user
declare global {
  namespace Express {
    interface Request {
      user?: any; // หรือจะกำหนด type ของ user object ให้เป๊ะก็ได้
    }
  }
}


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "ไม่พบ Token" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "รูปแบบ Token ไม่ถูกต้อง" });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // ✅ ใส่ไว้ใน req.user แบบปลอดภัย
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token ไม่ถูกต้องหรือหมดอายุ" });
  }
};
