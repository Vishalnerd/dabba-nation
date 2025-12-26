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
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    const rateLimitCheck = checkRateLimit(clientIp, 10, 60000);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many payment requests. Please try again later." },
        { status: 429 }
      );
    }

    await connectDB();

    const { orderId } = await req.json();

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

    if (order.paymentStatus === "paid") {
      return NextResponse.json(
        { success: false, error: "Order already paid" },
        { status: 400 }
      );
    }

    if (!order.totalAmount || order.totalAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid order amount" },
        { status: 400 }
      );
    }

    // 🔁 Idempotency: reuse existing Razorpay order
    if (order.razorpay?.orderId) {
      return NextResponse.json({
        success: true,
        razorpayOrderId: order.razorpay.orderId,
        amount: order.totalAmount * 100,
        currency: "INR",
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: order.totalAmount * 100,
      currency: "INR",
      receipt: order.orderId,
      notes: {
        orderId: order.orderId,
        package: order.package,
      },
    });

    // ✅ Save Razorpay order ID for webhook matching
    await Order.findOneAndUpdate(
      { orderId },
      { $set: { "razorpay.orderId": razorpayOrder.id } }
    );

    console.log("✅ [PAYMENT] Razorpay order created:", {
      orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalAmount,
    });

    return NextResponse.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (err: any) {
    console.error("Razorpay order error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
