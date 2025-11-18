import type { Request, Response, NextFunction } from "express";
import { verifyFirebaseToken } from "../services/firebaseAdmin";
import { appConfig } from "../config";

declare module "express-serve-static-core" {
  interface Request {
    firebaseAdmin?: {
      uid: string;
      email?: string;
    };
  }
}

export async function authenticateFirebaseAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing auth token" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = await verifyFirebaseToken(token);

    if (
      decoded.email &&
      appConfig.firebase.adminEmails.includes(decoded.email.toLowerCase())
    ) {
      req.firebaseAdmin = { uid: decoded.uid, email: decoded.email };
      return next();
    }

    return res.status(403).json({ message: "Unauthorized admin" });
  } catch (error: any) {
    return res.status(401).json({ message: error.message ?? "Unauthorized" });
  }
}
