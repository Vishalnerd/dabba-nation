// app/api/orders/[orderId]/lifecycle/route.ts
import { NextResponse } from "next/server";

// Order lifecycle status endpoint removed; respond with 410 Gone.
export async function GET() {
  return NextResponse.json(
    { success: false, error: "Order lifecycle removed" },
    { status: 410 }
  );
}
