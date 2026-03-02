// app/api/payments/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      internalOrderId 
    } = body;

    // 1. Create the expected signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest("hex");

    // 2. Compare signatures
    if (razorpay_signature === expectedSign) {
      await connectDB();
      
      // 3. Payment is VALID: Activate the Order
      const updatedOrder = await Order.findOneAndUpdate(
        { orderId: internalOrderId },
        { 
          paymentStatus: "paid", 
          active: true, 
          status: "confirmed" 
        },
        { new: true } // Returns the updated document
      );

      if (!updatedOrder) {
        return NextResponse.json({ error: "Order not found in DB" }, { status: 404 });
      }

      // ==========================================
      // 🚀 OPTIONAL: TRIGGER NOTIFICATIONS HERE
      // e.g., await notifyAdminWhatsApp(updatedOrder);
      // ==========================================

      return NextResponse.json({ 
        success: true, 
        message: "Payment verified successfully",
        order: updatedOrder
      });

    } else {
      // Signatures don't match (Possible fraud/tampering)
      await connectDB();
      await Order.findOneAndUpdate(
        { orderId: internalOrderId },
        { paymentStatus: "failed", status: "cancelled" }
      );

      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error during verification" },
      { status: 500 }
    );
  }
}