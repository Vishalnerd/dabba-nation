import crypto from "crypto";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const event = JSON.parse(body);

  await connectDB();

  /* -------- PAYMENT SUCCESS -------- */
  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;

    await Order.findOneAndUpdate(
      {
        "razorpay.orderId": payment.order_id,
        paymentStatus: { $ne: "paid" },
      },
      {
        $set: {
          paymentStatus: "paid",
          active: true, // 🔒 CRITICAL: Activate order only when payment captured
          "razorpay.paymentId": payment.id,
          paidAt: new Date(),
        },
      }
    );
  }

  /* -------- PAYMENT FAILED -------- */
  if (event.event === "payment.failed") {
    const payment = event.payload.payment.entity;

    await Order.findOneAndUpdate(
      {
        "razorpay.orderId": payment.order_id,
        paymentStatus: "pending",
      },
      {
        $set: {
          paymentStatus: "failed",
        },
      }
    );
  }

  return NextResponse.json({ success: true });
}
