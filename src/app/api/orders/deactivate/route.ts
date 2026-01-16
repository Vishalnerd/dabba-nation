// app/api/orders/deactivate/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Find the order and deactivate it
    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Deactivate the order
    order.active = false;
    order.status = "cancelled";
    await order.save();

    return NextResponse.json(
      { 
        success: true, 
        message: "Order deactivated successfully",
        orderId: order.orderId 
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error deactivating order:", err);
    return NextResponse.json(
      { success: false, error: "Failed to deactivate order" },
      { status: 500 }
    );
  }
}
