// app/api/admin/automation/process-lifecycle/route.ts
import { NextResponse } from "next/server";

// Lifecycle automation has been removed; respond with 410 Gone.
export async function POST() {
  return NextResponse.json(
    { success: false, error: "Lifecycle automation removed" },
    { status: 410 }
  );
}
