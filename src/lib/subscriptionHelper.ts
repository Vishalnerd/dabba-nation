import Order from "@/models/Order";

/**
 * Auto-expire subscriptions that have passed their end date
 * This is lazy expiration - called when needed, not on a schedule
 */
export async function autoExpireSubscriptions() {
  try {
    const now = new Date();
    
    const result = await Order.updateMany(
      {
        active: true,
        endDate: { $lt: now },
      },
      {
        $set: { 
          active: false, 
          status: "expired" 
        },
      }
    );

    return {
      success: true,
      expiredCount: result.modifiedCount,
    };
  } catch (error) {
    console.error("Error auto-expiring subscriptions:", error);
    return {
      success: false,
      expiredCount: 0,
    };
  }
}

/**
 * Check if user has an active subscription
 */
export async function hasActiveSubscription(userId: string) {
  try {
    // First, auto-expire any subscriptions
    await autoExpireSubscriptions();

    const activeOrder = await Order.findOne({
      user: userId,
      active: true,
      endDate: { $gte: new Date() },
    })
    .select('_id') // Only need to check existence
    .lean();

    return !!activeOrder;
  } catch (error) {
    console.error("Error checking active subscription:", error);
    return false;
  }
}

/**
 * Get user's active subscription
 */
export async function getActiveSubscription(userId: string) {
  try {
    // First, auto-expire any subscriptions
    await autoExpireSubscriptions();

    const activeOrder = await Order.findOne({
      user: userId,
      active: true,
      endDate: { $gte: new Date() },
    })
    .select('orderId package totalAmount status active startDate endDate')
    .lean();

    return activeOrder;
  } catch (error) {
    console.error("Error getting active subscription:", error);
    return null;
  }
}

/**
 * Calculate subscription dates based on package type
 */
export function calculateSubscriptionDates(packageType: string) {
  const now = new Date();
  let durationDays = 0;

  if (packageType === "trial" || packageType === "daily") durationDays = 1;
  if (packageType === "weekly") durationDays = 7;
  if (packageType === "monthly") durationDays = 30;

  const startDate = now;
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + durationDays);

  return { startDate, endDate };
}
