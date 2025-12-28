import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export interface JWTPayload {
  username: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Verify JWT token from Authorization header
 * @param req - Next.js request object
 * @returns Decoded JWT payload or null if invalid
 */
export function verifyAdminToken(req: NextRequest): JWTPayload | null {
  try {
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      console.error("JWT_SECRET not configured");
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    
    // Verify admin role
    if (decoded.role !== "admin") {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Extract and verify JWT token from request
 * @param token - JWT token string
 * @returns Decoded JWT payload or null if invalid
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      console.error("JWT_SECRET not configured");
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
