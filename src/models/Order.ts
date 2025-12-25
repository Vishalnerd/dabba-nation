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
    lastMealReset: {
      type: Date,
      default: Date.now,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    // Razorpay payment details
    razorpay: {
      orderId: String,
      paymentId: String,
      verifiedAt: Date,
    },
  },
  { timestamps: true }
);

// ==================== INDEXES ====================
// Index for orderId lookups (unique already creates index)
// Index for customer phone (spam prevention & lookups)
OrderSchema.index({ "customer.phone": 1 });

// Index for active orders retrieval
OrderSchema.index({ active: 1, createdAt: -1 });

// Index for payment status queries
OrderSchema.index({ paymentStatus: 1 });

// Compound index for admin dashboard (active + paid orders sorted by date)
OrderSchema.index({ active: 1, paymentStatus: 1, createdAt: -1 });

// Index for lifecycle automation (active orders with recent meal resets)
OrderSchema.index({ active: 1, lastMealReset: 1 });

export default models.Order || mongoose.model("Order", OrderSchema);



