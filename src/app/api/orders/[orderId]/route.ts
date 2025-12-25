// app/api/orders/[orderId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { checkRateLimit } from "@/lib/validations";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    // Rate limiting
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";
    const rateLimitCheck = checkRateLimit(clientIp, 20, 60000); // 20 requests per minute
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    await connectDB();

    const { orderId } = await params;

    // Validate orderId format
    if (!orderId || typeof orderId !== "string" || !orderId.startsWith("ORD-")) {
      return NextResponse.json(
        { success: false, error: "Invalid order ID format" },
        { status: 400 }
      );
    }

    const order = await Order.findOne({ orderId }).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Only return safe, non-sensitive data
    return NextResponse.json(
      {
        success: true,
        order: {
          orderId: order.orderId,
          customer: {
            name: order.customer?.name,
            phone: order.customer?.phone?.replace(/(\d{2})(\d{4})(\d{4})/, "$1****$3"), // Partially mask phone
            address: order.customer?.address,
            pincode: order.customer?.pincode,
          },
          package: order.package,
          totalAmount: order.totalAmount,
          paymentStatus: order.paymentStatus,
          active: order.active,
          createdAt: order.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error fetching order:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
