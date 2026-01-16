"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense, useMemo } from "react";
import Toast from "../components/ui/Toast";

const PLANS = {
  weekly: {
    title: "Weekly Tiffin",
    price: 455,
    duration: "7 Days",
    description: "Great for trying our service",
    savings: "Most Popular",
  },
  monthly: {
    title: "Monthly Tiffin",
    price: 1950,
    duration: "30 Days",
    description: "Perfect for daily meal needs",
    savings: "Save ₹450",
  },
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planKey = (searchParams.get("plan") as keyof typeof PLANS) || "weekly";

  // 1. Calculate Date Range (Today to +4 Days)
  const { minDate, maxDate } = useMemo(() => {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + 4);

    return {
      minDate: today.toISOString().split("T")[0],
      maxDate: future.toISOString().split("T")[0],
    };
  }, []);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    pincode: "",
    startDate: minDate,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const plan = PLANS[planKey];

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#F9F7F0] flex items-center justify-center px-6">
        <div className="bg-white border-4 border-[#333333] rounded-3xl p-8 text-center max-w-md shadow-[8px_8px_0px_#333333]">
          <h2 className="text-2xl font-black mb-2 uppercase">Invalid Plan</h2>
          <button
            onClick={() => router.push("/")}
            className="mt-4 bg-[#FF8C42] text-white px-8 py-3 rounded-2xl font-black"
          >
            BACK TO HOME
          </button>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, "")))
      newErrors.phone = "Enter a valid 10-digit number";
    if (formData.address.trim().length < 10)
      newErrors.address = "Please enter a complete address";
    if (!/^\d{6}$/.test(formData.pincode))
      newErrors.pincode = "Enter a valid 6-digit pincode";
    if (!formData.startDate) newErrors.startDate = "Pick a start date";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !validateForm()) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planKey,
          plan,
          customer: {
            fullName: formData.fullName, // matches your API expectation
            phone: formData.phone,
            address: formData.address,
            pincode: formData.pincode,
          },
          startDate: formData.startDate, // matches your model
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to place order");

      setToast({ message: "Order Success! Redirecting...", type: "success" });
      setTimeout(
        () => router.push(`/order-confirmation?orderId=${data.orderId}`),
        1500
      );
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F0] pt-24 pb-12 px-4 md:px-6 font-sans">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* LEFT: ORDER SUMMARY */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border-4 border-[#333333] rounded-[2rem] p-6 shadow-[8px_8px_0px_#333333] lg:sticky lg:top-28">
            <h2 className="text-2xl font-black text-[#333333] mb-6 uppercase tracking-tight">
              🍱 Your Order
            </h2>
            <div className="bg-[#F9F7F0] border-2 border-[#333333] rounded-2xl p-5 relative mb-6">
              <div className="absolute -top-3 -right-3 bg-[#FF8C42] text-white text-[10px] font-black px-3 py-1 rounded-lg rotate-12 border-2 border-[#333333]">
                {plan.savings}
              </div>
              <p className="font-black text-xl text-[#333333]">{plan.title}</p>
              <p className="text-3xl font-black text-[#FF8C42] mt-1">
                ₹{plan.price}
              </p>
              <p className="text-xs font-bold text-gray-400 uppercase mt-2">
                {plan.duration} Subscription
              </p>
            </div>

            <div className="space-y-3 px-2 border-t-2 border-dashed border-gray-200 pt-4">
              <div className="flex justify-between font-bold text-gray-500">
                <span>Subtotal</span>
                <span>₹{plan.price}</span>
              </div>
              <div className="flex justify-between font-bold text-[#A3D9A5]">
                <span>Delivery</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between font-black text-2xl text-[#333333] pt-2">
                <span>Total</span>
                <span>₹{plan.price}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: FORM */}
        <div className="lg:col-span-3">
          <div className="bg-white border-4 border-[#333333] rounded-[2rem] p-6 md:p-10 shadow-[12px_12px_0px_#FFD166]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-3xl font-black text-[#333333] mb-8 italic uppercase tracking-tighter">
                Delivery Info
              </h2>

              {/* START DATE FIELD */}
              <div className="bg-[#A3D9A5]/10 border-4 border-dashed border-[#333333] p-6 rounded-[2rem] relative">
                <div className="absolute -top-3 right-4 bg-[#A3D9A5] border-2 border-[#333333] px-3 py-1 rounded-lg font-black text-[10px] uppercase">
                  🗓️ Choose Start
                </div>
                <label className="block text-xs font-black uppercase mb-2 tracking-widest">
                  When should we start?
                </label>
                <input
                  type="date"
                  min={minDate}
                  max={maxDate}
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  className="w-full bg-white border-4 border-[#333333] rounded-xl px-4 py-3 font-bold outline-none focus:ring-4 focus:ring-[#FFD166]"
                />
                <p className="text-[10px] font-bold text-gray-400 mt-2">
                  * Delivery starts tomorrow if booked before 10 PM.
                </p>
              </div>

              {/* NAME & PHONE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase mb-2 tracking-widest">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className="w-full border-4 border-[#333333] rounded-xl px-4 py-3 font-bold outline-none focus:ring-4 focus:ring-[#FFD166]"
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-[10px] font-bold mt-1">
                      ⚠️ {errors.fullName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-black uppercase mb-2 tracking-widest">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full border-4 border-[#333333] rounded-xl px-4 py-3 font-bold outline-none focus:ring-4 focus:ring-[#FFD166]"
                    placeholder="98XXXXXXXX"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-[10px] font-bold mt-1">
                      ⚠️ {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* PINCODE */}
              <div>
                <label className="block text-xs font-black uppercase mb-2 tracking-widest">
                  Pincode
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  className="w-full border-4 border-[#333333] rounded-xl px-4 py-3 font-bold outline-none focus:ring-4 focus:ring-[#FFD166]"
                  placeholder="1100XX"
                />
                {errors.pincode && (
                  <p className="text-red-500 text-[10px] font-bold mt-1">
                    ⚠️ {errors.pincode}
                  </p>
                )}
              </div>

              {/* ADDRESS */}
              <div>
                <label className="block text-xs font-black uppercase mb-2 tracking-widest">
                  Full Address
                </label>
                <textarea
                  rows={3}
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full border-4 border-[#333333] rounded-xl px-4 py-3 font-bold outline-none focus:ring-4 focus:ring-[#FFD166]"
                  placeholder="Flat No, Building, Landmark..."
                />
                {errors.address && (
                  <p className="text-red-500 text-[10px] font-bold mt-1">
                    ⚠️ {errors.address}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FF8C42] text-white py-5 rounded-2xl font-black text-2xl shadow-[0px_8px_0px_#E86A33] active:translate-y-2 active:shadow-none transition-all border-2 border-[#333333] disabled:opacity-50"
              >
                {isSubmitting ? "PLACING ORDER..." : "GET MY DABBA →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F9F7F0] flex items-center justify-center font-black">
          LOADING...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
