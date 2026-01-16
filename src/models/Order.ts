// models/Order.ts
import mongoose, { Schema, models } from "mongoose";


const OrderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    package: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    customer: {
      name: String,
      fullName: String, // Support both fields for compatibility
      phone: String,
      address: String,
      pincode: String,
    },

    meals: {
      breakfast: {
        delivered: { type: Boolean, default: false },
        deliveredAt: Date,
      },
      lunch: {
        delivered: { type: Boolean, default: false },
        deliveredAt: Date,
      },
      dinner: {
        delivered: { type: Boolean, default: false },
        deliveredAt: Date,
      },
    },

    active: {
      type: Boolean,
      default: true, // subscription active
    },
    
    startDate: {
      type: Date,
      required: false,
    },

    endDate: {
      type: Date,
      required: false,
    },

    status: {
      type: String,
      enum: ["placed", "confirmed", "preparing", "delivered", "cancelled", "expired"],
      default: "placed",
    },

    lastMealReset: {
      type: Date,
      default: Date.now,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid","failed"],
      default: "pending",
    },

    user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},

  },
  { timestamps: true }
);

// ==================== INDEXES ====================
// Composite index for user + active status (most common query pattern)
OrderSchema.index({ user: 1, active: 1, endDate: -1 });

// Composite index for admin dashboard queries
OrderSchema.index({ active: 1, paymentStatus: 1, createdAt: -1 });

// Index for customer phone (spam prevention & lookups)
OrderSchema.index({ "customer.phone": 1 });

// Index for auto-expiration queries
OrderSchema.index({ active: 1, endDate: 1 });
OrderSchema.index({ active: 1, createdAt: -1 });

// Index for payment status queries
OrderSchema.index({ paymentStatus: 1 });

// Compound index for admin dashboard (active + paid orders sorted by date)
OrderSchema.index({ active: 1, paymentStatus: 1, createdAt: -1 });

// Index for lifecycle automation (active orders with recent meal resets)
OrderSchema.index({ active: 1, lastMealReset: 1 });

// Index for checking active subscriptions by user
OrderSchema.index({ user: 1, active: 1, endDate: 1 });

// Index for auto-expiring subscriptions
OrderSchema.index({ active: 1, endDate: 1 });

export default models.Order || mongoose.model("Order", OrderSchema);



