// app/api/admin/orders/update-status/route.ts
import { NextResponse } from "next/server";

// Order status updates are no longer supported; respond with 410 Gone.
export async function PATCH() {
  return NextResponse.json(
    { success: false, error: "Order status updates removed" },
    { status: 410 }
  );
}
