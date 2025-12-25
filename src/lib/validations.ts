// lib/validations.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dabba_nation";

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

// ==================== PHONE & PINCODE VALIDATION ====================
export function validatePhone(phone: string): boolean {
  // Indian phone number validation (10 digits, starts with 6-9)
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ""));
}

export function validatePincode(pincode: string): boolean {
  // Indian pincode validation (6 digits)
  const pincodeRegex = /^\d{6}$/;
  return pincodeRegex.test(pincode.replace(/\s+/g, ""));
}

// ==================== SPAM ORDER PREVENTION ====================
/**
 * Check if customer has placed multiple orders in a short time (spam prevention)
 * @param phone Customer phone number
 * @param timeWindowMinutes Time window in minutes (default: 5 minutes)
 * @param maxOrdersInWindow Maximum orders allowed in the time window (default: 3)
 */
export async function checkSpamOrders(
  phone: string,
  timeWindowMinutes: number = 5,
  maxOrdersInWindow: number = 3
): Promise<{ isSpam: boolean; recentOrderCount: number }> {
  try {
    await connectDB();

    const timeThreshold = new Date(Date.now() - timeWindowMinutes * 60 * 1000);

    const recentOrders = await Order.countDocuments({
      "customer.phone": phone,
      createdAt: { $gte: timeThreshold },
    });

    return {
      isSpam: recentOrders >= maxOrdersInWindow,
      recentOrderCount: recentOrders,
    };
  } catch (err: any) {
    console.error("Spam check error:", err);
    return { isSpam: false, recentOrderCount: 0 };
  }
}

// ==================== RATE LIMITING ====================
interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const rateLimitStore: RateLimitStore = {};

/**
 * Rate limiting middleware
 * @param identifier Unique identifier (IP, phone, etc.)
 * @param maxRequests Maximum requests allowed
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = identifier;

  if (!rateLimitStore[key]) {
    rateLimitStore[key] = { count: 1, resetTime: now + windowMs };
    return { allowed: true, remaining: maxRequests - 1, resetTime: rateLimitStore[key].resetTime };
  }

  const record = rateLimitStore[key];

  // Reset if window has passed
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return { allowed: true, remaining: maxRequests - 1, resetTime: record.resetTime };
  }

  // Check if limit exceeded
  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count, resetTime: record.resetTime };
}

// ==================== ADMIN MISUSE PREVENTION ====================
interface AdminActionLog {
  adminToken: string;
  action: string;
  timestamp: number;
  count: number;
  resetTime: number;
}

const adminActionLog: Map<string, AdminActionLog> = new Map();

/**
 * Check for admin abuse patterns (too many status updates, suspicious activity)
 * @param adminToken Admin authentication token
 * @param action Type of action (e.g., "status_update", "order_delete")
 * @param timeWindowSeconds Time window in seconds (default: 60 seconds)
 * @param maxActionsInWindow Maximum actions allowed (default: 20 updates per minute)
 */
export function checkAdminMisuse(
  adminToken: string,
  action: string = "status_update",
  timeWindowSeconds: number = 60,
  maxActionsInWindow: number = 20
): { allowed: boolean; remaining: number; reason?: string } {
  const now = Date.now();
  const key = `${adminToken}:${action}`;

  if (!adminActionLog.has(key)) {
    adminActionLog.set(key, {
      adminToken,
      action,
      timestamp: now,
      count: 1,
      resetTime: now + timeWindowSeconds * 1000,
    });
    return { allowed: true, remaining: maxActionsInWindow - 1 };
  }

  const log = adminActionLog.get(key)!;

  // Reset if window has passed
  if (now > log.resetTime) {
    log.count = 1;
    log.resetTime = now + timeWindowSeconds * 1000;
    return { allowed: true, remaining: maxActionsInWindow - 1 };
  }

  // Check if limit exceeded
  if (log.count >= maxActionsInWindow) {
    return {
      allowed: false,
      remaining: 0,
      reason: `Too many ${action} requests. Please try again later.`,
    };
  }

  log.count++;
  return { allowed: true, remaining: maxActionsInWindow - log.count };
}

/**
 * Log admin actions for audit trail
 * @param adminToken Admin token
 * @param action Action performed
 * @param details Additional details
 */
export function logAdminAction(
  adminToken: string,
  action: string,
  details: any = {}
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    adminToken: adminToken.substring(0, 10) + "***", // Hide token in logs
    action,
    details,
  };

  // In production, store this in a database
  console.log("[ADMIN AUDIT]", JSON.stringify(logEntry));
}

/**
 * Validate admin token format
 */
export function validateAdminToken(token: string | null): boolean {
  if (!token) return false;

  const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
  return token === ADMIN_TOKEN && token.length > 0;
}
