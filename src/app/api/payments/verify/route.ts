import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { checkRateLimit } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting for payment verification
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";
    const rateLimitCheck = checkRateLimit(clientIp, 10, 60000); // 10 verifications per minute
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many verification attempts. Please try again later." },
        { status: 429 }
      );
    }

    await connectDB();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = await req.json();

    // ✅ 1. Validate input - all fields required
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      return NextResponse.json(
        { success: false, error: "Missing payment details" },
        { status: 400 }
      );
    }

    // ✅ 1.5. Validate input format
    if (typeof razorpay_order_id !== "string" || 
        typeof razorpay_payment_id !== "string" || 
        typeof razorpay_signature !== "string" ||
        typeof orderId !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid payment data format" },
        { status: 400 }
      );
    }

    // ✅ 2. Fetch order
    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // ✅ 3. Prevent double payment
    if (order.paymentStatus === "paid") {
      return NextResponse.json({ 
        success: true, 
        message: "Payment already verified",
        alreadyPaid: true 
      });
    }

    // ✅ 3.5. Check if payment is too old (prevent replay attacks)
    const orderAge = Date.now() - new Date(order.createdAt).getTime();
    const MAX_ORDER_AGE = 24 * 60 * 60 * 1000; // 24 hours
    if (orderAge > MAX_ORDER_AGE) {
      return NextResponse.json(
        { success: false, error: "Order expired. Please create a new order." },
        { status: 400 }
      );
    }

    // ✅ 4. Verify Razorpay secret exists
    if (!process.env.RAZORPAY_API_SECRET) {
      console.error("RAZORPAY_API_SECRET not configured");
      return NextResponse.json(
        { success: false, error: "Payment configuration error" },
        { status: 500 }
      );
    }

    // ✅ 5. Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      // Log failed verification attempt
      console.error("Payment signature mismatch", {
        orderId,
        razorpay_order_id,
        razorpay_payment_id,
        clientIp,
      });
      
      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // ✅ 6. Mark order as paid + store Razorpay IDs (atomic update)
    const updatedOrder = await Order.findOneAndUpdate(
      { 
        orderId,
        paymentStatus: "pending" // Only update if still pending
      },
      {
        $set: {
          paymentStatus: "paid",
          "razorpay.orderId": razorpay_order_id,
          "razorpay.paymentId": razorpay_payment_id,
          "razorpay.verifiedAt": new Date(),
        }
      },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: "Order already processed or not found" },
        { status: 409 }
      );
    }

    // Log successful verification
    console.log("Payment verified successfully", { orderId, razorpay_payment_id });

    return NextResponse.json({ 
      success: true,
      message: "Payment verified successfully"
    });
  } catch (err: any) {
    console.error("Payment verification error:", err);
    return NextResponse.json(
      { success: false, error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
