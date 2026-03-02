// app/api/payments/razorpay/route.ts
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { planKey, customer, startDate } = body;

    // 1. Calculate Amount based on plan (in paise for Razorpay)
    const amountInRupees = planKey === "monthly" ? 1950 : 455;
    const amountInPaise = amountInRupees * 100;

    const internalOrderId = "ORD-" + Date.now();

    // 2. Create Razorpay Order
    const rzpOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: internalOrderId,
      notes: {
        internalOrderId: internalOrderId,
      }
    });

    // 3. Find or Create User
    let user = await User.findOne({ phone: customer.phone });
    if (!user) {
      user = await User.create({
        phone: customer.phone,
        name: customer.fullName,
      });
    }

    // 4. Calculate End Date based on the selected Start Date
    const start = new Date(startDate);
    const end = new Date(startDate);
    if (planKey === "weekly") {
      end.setDate(start.getDate() + 7);
    } else if (planKey === "monthly") {
      end.setDate(start.getDate() + 30);
    }

    // 5. Save "Pending" Order in Database
    const dbOrder = await Order.create({
      orderId: internalOrderId,
      user: user._id,
      package: planKey,
      totalAmount: amountInRupees,
      customer: {
        name: customer.fullName, // Model uses 'name'
        phone: customer.phone,
        address: customer.address,
        pincode: customer.pincode,
      },
      paymentStatus: "pending",
      status: "placed",
      active: false, // Remains false until payment is verified
      startDate: start,
      endDate: end,
      meals: {
        breakfast: { delivered: false },
        lunch: { delivered: false },
        dinner: { delivered: false },
      },
    });

    // 6. Send the Razorpay Order ID back to the frontend
    return NextResponse.json({
      id: rzpOrder.id,
      amount: amountInPaise,
      order: dbOrder,
    });
    
  } catch (error: any) {
    console.error("Razorpay Order Creation Error:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment. Please try again." },
      { status: 500 }
    );
  }
}