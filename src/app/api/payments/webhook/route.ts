import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  try {
    // 1. Get the raw text body for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    // 2. Your Webhook Secret (Set this in Razorpay Dashboard and .env.local)
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("Webhook secret is missing");
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    // 3. Verify the signature to ensure it's actually from Razorpay
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Invalid Webhook Signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 4. Parse the verified payload
    const event = JSON.parse(rawBody);

    // 5. Handle the 'order.paid' event
    if (event.event === "order.paid") {
      const paymentData = event.payload.payment.entity;
      const orderData = event.payload.order.entity;
      
      // Get our internal DB Order ID from the notes we passed earlier
      const internalOrderId = orderData.notes.internalOrderId;

      if (internalOrderId) {
        await connectDB();

        // 6. Idempotency Check & Update
        // We only update if it's currently "pending". If the frontend verification
        // already marked it as "paid", we don't need to do it twice.
        const updatedOrder = await Order.findOneAndUpdate(
          { 
            orderId: internalOrderId,
            paymentStatus: "pending" // Only update if pending
          },
          { 
            paymentStatus: "paid", 
            active: true, 
            status: "confirmed" 
          },
          { new: true }
        );

        if (updatedOrder) {
          console.log(`Webhook Activated Order: ${internalOrderId}`);
          // 🚀 OPTIONAL: Trigger WhatsApp/Email notification here!
        } else {
          console.log(`Order ${internalOrderId} already paid or not found.`);
        }
      }
    }

    // 7. Always return a 200 OK to Razorpay so they know you received it
    return NextResponse.json({ status: "ok" });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}