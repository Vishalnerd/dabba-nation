import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/validations";

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

    await connectDB();

    // Get pagination parameters from query string
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100); // Max 100 per page
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalOrders = await Order.countDocuments({});
    const totalPages = Math.ceil(totalOrders / limit);

    const orders = await Order.find({})
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .select("orderId paymentStatus createdAt customer package totalAmount active"); // Only select needed fields

    return Response.json({ 
      success: true, 
      count: orders.length,
      totalOrders,
      totalPages,
      currentPage: page,
      orders: orders.map(o => ({
        orderId: o.orderId,
        paymentStatus: o.paymentStatus,
        createdAt: o.createdAt,
        customer: o.customer,
        package: o.package,
        totalAmount: o.totalAmount,
        active: o.active
      }))
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return Response.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
