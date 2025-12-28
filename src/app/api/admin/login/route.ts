import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/validations";
import * as jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting for login attempts (prevent brute force)
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";
    const rateLimitCheck = checkRateLimit(clientIp + ":admin_login", 5, 60000); // 5 attempts per minute
    
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const { username, password } = await req.json();

    // Validate input
    if (!username || !password || typeof username !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid credentials format" },
        { status: 400 }
      );
    }

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !JWT_SECRET) {
      console.error("Admin environment variables not configured");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Generate JWT token
      const expiresIn: string = process.env.JWT_EXPIRES_IN || "7d";
      // @ts-ignore - expiresIn type inference issue
      const token = jwt.sign(
        { 
          username, 
          role: "admin",
        },
        JWT_SECRET,
        { expiresIn }
      );

      // Log successful admin login
      console.log("✅ [ADMIN] Login success:", { ip: clientIp, timestamp: new Date().toISOString() });
      
      return NextResponse.json({
        success: true,
        token,
      });
    }

    // Log failed login attempt
    console.warn("⚠️ [ADMIN] Login failed:", { ip: clientIp, username, timestamp: new Date().toISOString() });

    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 401 }
    );
  } catch (err: any) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    );
  }
}
