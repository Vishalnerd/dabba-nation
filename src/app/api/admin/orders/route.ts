// app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/Order";
import connectDB from "@/lib/db";
import { checkAdminMisuse, checkRateLimit } from "@/lib/validations";
import { verifyAdminToken } from "@/lib/auth";

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

    // --- JWT ADMIN CHECK ---
    const decodedToken = verifyAdminToken(req);
    
    if (!decodedToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Check for admin misuse on data retrieval
    const abuseCheck = checkAdminMisuse(decodedToken.username, "fetch_orders", 60, 30); // 30 fetches per minute
    if (!abuseCheck.allowed) {
      return NextResponse.json(
        { success: false, error: abuseCheck.reason || "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
    // --- END ADMIN CHECK ---

    await connectDB();
    
    // 3️⃣ PAGINATION
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;
    
    // ⚡ OPTIMIZED QUERY: Only select necessary fields to reduce payload size
    const orders = await Order.find({ 
      active: true,
      paymentStatus: "paid" // 🔒 CRITICAL: Block unpaid orders from showing
    })
    .select(
      "orderId customer.name customer.phone customer.address customer.pincode " +
      "package paymentStatus createdAt totalAmount " +
      "meals.breakfast.delivered meals.breakfast.deliveredAt " +
      "meals.lunch.delivered meals.lunch.deliveredAt " +
      "meals.dinner.delivered meals.dinner.deliveredAt " +
      "lastMealReset"
    )
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean(); // Use lean() for better performance - returns plain JS objects

    // Get total count for pagination
    const totalOrders = await Order.countDocuments({
      active: true,
      paymentStatus: "paid"
    });

    // ⚡ OPTIMIZED MEAL RESET: Batch update instead of individual saves
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ordersToReset = orders.filter(order => {
      if (order.package === "daily") return false;
      const lastReset = new Date(order.lastMealReset);
      lastReset.setHours(0, 0, 0, 0);
      return lastReset < today;
    });

    // Batch update orders that need meal reset
    if (ordersToReset.length > 0) {
      await Order.updateMany(
        {
          orderId: { $in: ordersToReset.map(o => o.orderId) }
        },
        {
          $set: {
            "meals.breakfast.delivered": false,
            "meals.lunch.delivered": false,
            "meals.dinner.delivered": false,
            lastMealReset: new Date()
          },
          $unset: {
            "meals.breakfast.deliveredAt": "",
            "meals.lunch.deliveredAt": "",
            "meals.dinner.deliveredAt": ""
          }
        }
      );

      // Update local data for response
      ordersToReset.forEach(order => {
        order.meals = {
          breakfast: { delivered: false },
          lunch: { delivered: false },
          dinner: { delivered: false }
        };
        order.lastMealReset = new Date();
      });
    }

    return NextResponse.json({ 
      success: true, 
      orders,
      pagination: {
        page,
        limit,
        total: totalOrders,
        totalPages: Math.ceil(totalOrders / limit)
      }
    });

    
  } catch (err: any) {
    console.error("Error fetching orders:", err);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch orders" 
      }, 
      { status: 500 }
    );
  }
}
