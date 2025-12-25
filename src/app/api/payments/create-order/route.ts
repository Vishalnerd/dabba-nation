import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { checkRateLimit } from "@/lib/validations";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY!,
  key_secret: process.env.RAZORPAY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";
    const rateLimitCheck = checkRateLimit(clientIp, 10, 60000); // 10 payment orders per minute
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many payment requests. Please try again later." },
        { status: 429 }
      );
    }

    await connectDB();

    const { orderId } = await req.json();

    // Validate orderId
    if (!orderId || typeof orderId !== "string" || !orderId.startsWith("ORD-")) {
      return NextResponse.json(
        { success: false, error: "Invalid order ID" },
        { status: 400 }
      );
    }

    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Prevent payment for already paid orders
    if (order.paymentStatus === "paid") {
      return NextResponse.json(
        { success: false, error: "Order already paid" },
        { status: 400 }
      );
    }

    // Validate amount
    if (!order.totalAmount || order.totalAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid order amount" },
        { status: 400 }
      );
    }

    // Check Razorpay configuration
    if (!process.env.RAZORPAY_API_KEY || !process.env.RAZORPAY_API_SECRET) {
      console.error("Razorpay credentials not configured");
      return NextResponse.json(
        { success: false, error: "Payment system configuration error" },
        { status: 500 }
      );
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: order.totalAmount * 100, // Convert to paise
      currency: "INR",
      receipt: order.orderId,
      notes: {
        orderId: order.orderId,
        package: order.package,
      },
    });

    // Log payment order creation
    console.log("[PAYMENT ORDER CREATED]", { 
      orderId, 
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalAmount 
    });

    return NextResponse.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_API_KEY,
    });
  } catch (err: any) {
    console.error("Razorpay order error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
