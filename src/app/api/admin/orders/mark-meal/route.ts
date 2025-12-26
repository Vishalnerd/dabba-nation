import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/Order";
import connectDB from "@/lib/db";
import { validateAdminToken, logAdminAction } from "@/lib/validations";

export async function PATCH(req: NextRequest) {
  try {
    /* ---------------- ADMIN AUTH ---------------- */
    const token = req.headers.get("x-admin-token");

    if (!token || !validateAdminToken(token)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* ---------------- DB ---------------- */
    await connectDB();

    /* ---------------- BODY ---------------- */
    const { orderId, meal } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "orderId is required" },
        { status: 400 }
      );
    }

    const validMeals = ["breakfast", "lunch", "dinner"] as const;
    if (!meal || !validMeals.includes(meal)) {
      return NextResponse.json(
        { success: false, error: "Invalid meal type" },
        { status: 400 }
      );
    }

    /* ---------------- FETCH ORDER ---------------- */
    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    /* ---------------- PAYMENT VERIFICATION ---------------- */
    // 🔒 CRITICAL: Block meal delivery for unpaid orders
    if (order.paymentStatus !== "paid") {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot mark meal as delivered - Payment not confirmed",
          paymentStatus: order.paymentStatus
        },
        { status: 403 }
      );
    }

    /* ---------------- DOUBLE DELIVERY PROTECTION ---------------- */
    if (order.meals?.[meal]?.delivered) {
      return NextResponse.json(
        {
          success: false,
          error: `${meal} already marked as delivered`,
        },
        { status: 400 }
      );
    }

    /* ---------------- UPDATE MEAL ---------------- */
    const updateData: any = {
      [`meals.${meal}.delivered`]: true,
      [`meals.${meal}.deliveredAt`]: new Date(),
    };

    /* ---------------- DAILY PACKAGE AUTO CLOSE ---------------- */
    if (meal === "dinner" && order.package === "daily") {
      updateData.active = false;
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { $set: updateData },
      { new: true }
    );

    /* ---------------- AUDIT LOG ---------------- */
    logAdminAction(token, "meal_marked_delivered", {
      orderId,
      meal,
      package: order.package,
    });

    return NextResponse.json(
      {
        success: true,
        message: `${meal} marked as delivered`,
        order: updatedOrder,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error marking meal:", err);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to mark meal as delivered" 
      },
      { status: 500 }
    );
  }
}
