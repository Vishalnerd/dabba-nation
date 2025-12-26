// lib/logger.ts - Production-safe logging utility

const isProd = process.env.NODE_ENV === 'production';

/**
 * Logging utility that only logs in development
 * Use this for debugging/development logs that aren't needed in production
 */
export const devLog = (...args: any[]) => {
  if (!isProd) {
    console.log(...args);
  }
};

/**
 * Critical logs that should appear in production
 * Use for: Payment events, Admin actions, Security events, Errors
 */
export const criticalLog = (category: string, ...args: any[]) => {
  console.log(`[${category}]`, ...args);
};

/**
 * Warning logs - always shown
 * Use for: Security warnings, Configuration issues, Rate limiting
 */
export const warnLog = (category: string, ...args: any[]) => {
  console.warn(`⚠️ [${category}]`, ...args);
};

/**
 * Error logs - always shown
 * Use for: Exceptions, Failed operations
 */
export const errorLog = (category: string, ...args: any[]) => {
  console.error(`❌ [${category}]`, ...args);
};

/**
 * Payment-specific logs - always shown
 * Use for: Payment verification, Order creation, Webhook events
 */
export const paymentLog = (event: string, data: any) => {
  console.log(`💳 [PAYMENT] ${event}:`, data);
};

/**
 * Admin action logs - always shown  
 * Use for: Login/logout, Meal marking, Order updates
 */
export const adminLog = (action: string, data: any) => {
  console.log(`🔒 [ADMIN] ${action}:`, data);
};

/**
 * Webhook logs - always shown
 * Use for: Razorpay webhooks, External API calls
 */
export const webhookLog = (event: string, data: any) => {
  console.log(`🔔 [WEBHOOK] ${event}:`, data);
};
