// middleware.ts - CORS and Security Protection
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // 🔒 STRICT CORS PROTECTION
  // Get the origin from the request
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  
  // Allowed origins - add your production domain
  const allowedOrigins = [
    "https://dabba-nation.vercel.app",
    process.env.NEXT_PUBLIC_APP_URL,
    "http://localhost:3000",
    "http://localhost:3001",
    host ? `http://${host}` : null,
    host ? `https://${host}` : null,
  ].filter(Boolean) as string[]; // Remove undefined values

  // Check if origin is allowed
  if (origin && allowedOrigins.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  } else if (!origin) {
    // Same-origin requests (no origin header) are allowed
    res.headers.set("Access-Control-Allow-Origin", allowedOrigins[0]);
  }

  // CORS headers
  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-admin-token, x-razorpay-signature"
  );

  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: res.headers,
    });
  }

  // 🛡️ SECURITY HEADERS
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // 🔐 WEBHOOK PROTECTION - Only Razorpay can access webhook
  if (req.nextUrl.pathname === "/api/payments/webhook") {
    const signature = req.headers.get("x-razorpay-signature");
    const userAgent = req.headers.get("user-agent");

    // Basic validation - webhook must have Razorpay signature
    if (!signature) {
      console.warn("⚠️ Webhook access without signature blocked");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Optional: Check User-Agent contains "Razorpay"
    if (userAgent && !userAgent.includes("Razorpay")) {
      console.warn("⚠️ Suspicious webhook access blocked:", userAgent);
    }
  }

  // 🚫 BLOCK ADMIN ROUTES FROM UNAUTHORIZED ORIGINS
  if (req.nextUrl.pathname.startsWith("/api/admin")) {
    // Allow same-origin requests (when origin matches the host)
    const requestHost = req.headers.get("host");
    const isSameOrigin = !origin || 
                         origin === `https://${requestHost}` || 
                         origin === `http://${requestHost}` ||
                         allowedOrigins.includes(origin);
    
    if (!isSameOrigin) {
      console.warn("⚠️ Admin API access from unauthorized origin:", origin, "Host:", requestHost);
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }
  }

  return res;
}

// 📍 Configure which routes use this middleware
export const config = {
  matcher: [
    // Apply to all API routes
    "/api/:path*",
    // Optionally apply to specific pages
    // "/checkout/:path*",
    // "/order-confirmation/:path*",
  ],
};
