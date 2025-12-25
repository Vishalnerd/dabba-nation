// app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";
import { checkAdminMisuse, validateAdminToken, checkRateLimit } from "@/lib/validations";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dabba_nation";

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

export async function GET(req: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";

    // ✅ Rate limit check (60 requests per minute)
    const rateLimitCheck = checkRateLimit(clientIp, 60, 60000);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // --- ADMIN CHECK ---
    const token = req.headers.get("x-admin-token"); // expect token from frontend
    
    // ✅ Validate admin token
    if (!validateAdminToken(token)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Check for admin misuse on data retrieval
    const abuseCheck = checkAdminMisuse(token, "fetch_orders", 60, 30); // 30 fetches per minute
    if (!abuseCheck.allowed) {
      return NextResponse.json(
        { success: false, error: abuseCheck.reason || "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
    // --- END ADMIN CHECK ---

    await connectDB();
  const orders = await Order.find({ active: true }).sort({ createdAt: -1 });

const today = new Date();
today.setHours(0, 0, 0, 0);

for (const order of orders) {
  // Skip daily packages
  if (order.package === "daily") continue;

  const lastReset = new Date(order.lastMealReset);
  lastReset.setHours(0, 0, 0, 0);

  // If new day → reset meals
  if (lastReset < today) {
    order.meals = {
      breakfast: { delivered: false },
      lunch: { delivered: false },
      dinner: { delivered: false },
    };

    order.lastMealReset = new Date();
    await order.save();
  }
}

return NextResponse.json({ success: true, orders });

    
  } catch (err: any) {
    console.error("Error fetching orders:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
