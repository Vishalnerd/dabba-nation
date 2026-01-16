import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/validations";
import jwt from "jsonwebtoken";
import { autoExpireSubscriptions } from "@/lib/subscriptionHelper";

export async function GET(req: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";

    // Rate limit: 30 requests per minute
    const rateLimitCheck = checkRateLimit(clientIp, 30, 60000);
    if (!rateLimitCheck.allowed) {
      return Response.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Verify JWT token
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json(
        { success: false, error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let userId: string;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      userId = decoded.userId;
    } catch (err) {
      return Response.json(
        { success: false, error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    await connectDB();

    // Auto-expire subscriptions (lazy expiration)
    await autoExpireSubscriptions();

    // Get pagination parameters from query string
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 100); // Max 100 per page
    const skip = (page - 1) * limit;

    // Filter orders by user ID
    const query = { user: userId };

    // Get total count for pagination metadata
    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limit);

    // ⚡ OPTIMIZED: Use lean() for better performance
    const orders = await Order.find(query)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .select("orderId paymentStatus createdAt customer package totalAmount active status startDate endDate")
      .lean(); // Returns plain JS objects - faster than Mongoose documents

    return Response.json({ 
      success: true, 
      count: orders.length,
      totalOrders,
      totalPages,
      currentPage: page,
      orders // No need to map - lean() already returns plain objects
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return Response.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
