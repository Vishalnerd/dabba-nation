// app/api/orders/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import {
  validatePhone,
  validatePincode,
  checkSpamOrders,
  checkRateLimit,
} from "@/lib/validations";

// Package prices
const PACKAGE_PRICES: Record<string, number> = {
  daily: 70,
  weekly: 455,
  monthly: 1950,
};

export async function POST(req: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";

    // Rate limit check (10 requests per minute per IP)
    const rateLimitCheck = checkRateLimit(clientIp, 10, 60000);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    await connectDB();

    const body = await req.json();
    const { planKey, plan, customer } = body;

    // Map planKey to package type
    const planToPackageMap: Record<string, string> = {
      trial: "daily",
      weekly: "weekly",
      monthly: "monthly",
    };

    const selectedPackage = planToPackageMap[planKey] || planKey;

    // Validate package
    if (!PACKAGE_PRICES[selectedPackage]) {
      return NextResponse.json(
        { success: false, error: "Invalid package selected" },
        { status: 400 }
      );
    }

    // Validate customer fields
    if (!customer?.fullName || !customer?.phone || !customer?.address || !customer?.pincode) {
      return NextResponse.json(
        { success: false, error: "Customer information is incomplete" },
        { status: 400 }
      );
    }

    // ✅ Validate phone number format
    if (!validatePhone(customer.phone)) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number. Please enter a valid 10-digit Indian phone number." },
        { status: 400 }
      );
    }

    // ✅ Validate pincode format
    if (!validatePincode(customer.pincode)) {
      return NextResponse.json(
        { success: false, error: "Invalid pincode. Please enter a valid 6-digit pincode." },
        { status: 400 }
      );
    }

    // ✅ Check for spam orders (prevent duplicate orders from same customer)
    const spamCheck = await checkSpamOrders(customer.phone, 5, 3); // 3 orders in 5 minutes = spam
    if (spamCheck.isSpam) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many orders placed recently. You have ${spamCheck.recentOrderCount} orders in the last 5 minutes. Please wait before placing another order.`,
        },
        { status: 429 }
      );
    }

    const totalAmount = plan?.price || PACKAGE_PRICES[selectedPackage];

    // Generate unique orderId
    const orderId = "ORD-" + Date.now();

    const newOrder = new Order({
      orderId,
      package: selectedPackage,
      totalAmount,
      customer: {
        name: customer.fullName,
        phone: customer.phone,
        address: customer.address,
        pincode: customer.pincode,
      },
      paymentStatus: "pending",
      active: false, // 🔒 CRITICAL: Order inactive until payment confirmed
      meals: {
        breakfast: { delivered: false },
        lunch: { delivered: false },
        dinner: { delivered: false },
      },
    });

    const savedOrder = await newOrder.save();

    return NextResponse.json({ success: true, orderId, order: savedOrder }, { status: 201 });
  } catch (err: any) {
    console.error("Error creating order:", err);
    console.error("Error stack:", err.stack);
    console.error("Error details:", {
      name: err.name,
      message: err.message,
      code: err.code,
    });
    
    // 🔒 SECURITY: Hide error details in production
    const isProduction = process.env.NODE_ENV === 'production';
    
    return NextResponse.json({ 
      success: false, 
      error: isProduction ? "Failed to create order" : err.message,
      details: isProduction ? undefined : err.stack
    }, { status: 500 });
  }
}
