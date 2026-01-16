"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Toast from "../components/ui/Toast";

const PLANS = {
  monthly: {
    title: "Monthly Tiffin",
    price: 1950,
    duration: "30 Days",
    description: "Perfect for daily meal needs",
    savings: "Save ₹450",
  },
  weekly: {
    title: "Weekly Tiffin",
    price: 455,
    duration: "7 Days",
    description: "Great for trying our service",
    savings: "Most Popular",
  },
  trial: {
    title: "Trial Tiffin",
    price: 70,
    duration: "1 Day",
    description: "Experience our home-cooked meals",
    savings: "Risk Free",
  },
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planKey = (searchParams.get("plan") as keyof typeof PLANS) || "trial";

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    pincode: "",
  });

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const plan = PLANS[planKey];

  if (!plan) {
    // Standard error view (unchanged logic)
    return (
      <div className="min-h-screen bg-[#F9F7F0] flex items-center justify-center px-6">
        <div className="bg-white border-4 border-[#333333] rounded-3xl p-8 shadow-[8px_8px_0px_#333333] text-center max-w-md">
          <h2 className="text-2xl font-black text-[#333333] mb-2">
            Invalid Plan
          </h2>
          <button
            onClick={() => router.push("/")}
            className="mt-4 bg-[#FF8C42] text-white px-6 py-2 rounded-xl font-bold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, "")))
      newErrors.phone = "Enter 10-digit phone";
    if (formData.address.trim().length < 10)
      newErrors.address = "Address is too short";
    if (!/^\d{6}$/.test(formData.pincode))
      newErrors.pincode = "Enter 6-digit pincode";
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
      const orderResponse = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planKey,
          plan,
          customer: formData,
        }),
      });

      if (!orderResponse.ok) throw new Error("Failed to create order");
      const orderData = await orderResponse.json();

      setToast({ message: "Order placed! Redirecting...", type: "success" });
      setTimeout(() => {
        router.push(
          `/order-confirmation?orderId=${orderData.orderId}&status=pending`
        );
      }, 1000);
    } catch (err) {
      setToast({
        message: "Failed to process order. Try again!",
        type: "error",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F0] relative overflow-x-hidden font-sans">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#FFD166] rounded-full opacity-10 -translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#FF8C42] rounded-full opacity-10 translate-x-24 translate-y-24"></div>

      <div className="relative z-10 pt-16 md:pt-24 pb-6">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#FFD166] text-[#333333] text-[10px] md:text-xs font-black uppercase tracking-widest mb-4 border-2 border-[#333333] shadow-[4px_4px_0px_#333333]">
              🚀 Secure Checkout
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#333333] mb-2 leading-tight">
              Finish Your <span className="text-[#FF8C42]">Dabba Request</span>
            </h1>
            <p className="text-sm md:text-lg text-gray-600 font-bold max-w-md mx-auto">
              Just one step away from piping hot, home-style meals!
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* PLAN SUMMARY - Stays at top on Mobile, sticky on Desktop */}
          <div className="lg:col-span-2 order-1 lg:order-1">
            <div className="bg-white rounded-[2rem] p-6 shadow-[8px_8px_0px_rgba(0,0,0,0.1)] border-4 border-[#333333] lg:sticky lg:top-28">
              <h2 className="text-2xl font-black text-[#333333] mb-6 flex items-center gap-2 uppercase tracking-tighter">
                <span className="text-2xl">🍱</span> Your Order
              </h2>

              <div className="bg-[#F9F7F0] rounded-2xl p-5 border-2 border-[#333333] relative">
                <div className="absolute -top-3 -right-3 bg-[#FF8C42] text-white text-[10px] font-black px-3 py-1 rounded-lg rotate-12 shadow-md border-2 border-[#333333]">
                  {plan.savings}
                </div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-[#333333]">
                      {plan.title}
                    </h3>
                    <p className="text-gray-500 font-bold text-sm uppercase">
                      {plan.duration}
                    </p>
                  </div>
                  <p className="text-2xl md:text-3xl font-black text-[#FF8C42]">
                    ₹{plan.price}
                  </p>
                </div>

                <div className="space-y-3 border-t-2 border-dashed border-[#333333]/20 pt-4">
                  {[
                    "Lunch + Dinner included",
                    "Fresh home-style cooking",
                    "Hygienic standards",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center text-[#333333] font-bold text-xs md:text-sm"
                    >
                      <div className="w-5 h-5 mr-3 bg-[#A3D9A5] rounded-full border-2 border-[#333333] flex items-center justify-center shrink-0">
                        <CheckIcon className="w-3 h-3 text-white" />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="mt-8 space-y-3 px-2">
                <div className="flex justify-between font-bold text-gray-500 text-sm">
                  <span>Subtotal</span>
                  <span>₹{plan.price}</span>
                </div>
                <div className="flex justify-between font-bold text-[#A3D9A5] text-sm">
                  <span>Delivery Charge</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between items-center text-2xl md:text-3xl font-black text-[#333333] border-t-4 border-[#333333] pt-4 mt-4 uppercase tracking-tighter">
                  <span>Total</span>
                  <span>₹{plan.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* DELIVERY FORM - Primary Action Area */}
          <div className="lg:col-span-3 order-2 lg:order-2">
            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-[12px_12px_0px_#FFD166] border-4 border-[#333333]">
              <h2 className="text-2xl md:text-3xl font-black text-[#333333] mb-8 uppercase tracking-tighter italic">
                Delivery Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {[
                  {
                    label: "Full Name",
                    id: "fullName",
                    type: "text",
                    placeholder: "Your Name",
                  },
                  {
                    label: "Phone Number",
                    id: "phone",
                    type: "tel",
                    placeholder: "10-digit mobile number",
                  },
                  {
                    label: "Area Pincode",
                    id: "pincode",
                    type: "text",
                    placeholder: "6-digit code",
                  },
                ].map((field) => (
                  <div key={field.id}>
                    <label className="block text-[10px] md:text-xs font-black text-[#333333] uppercase tracking-widest mb-2">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={formData[field.id as keyof typeof formData]}
                      onChange={(e) =>
                        handleInputChange(field.id, e.target.value)
                      }
                      placeholder={field.placeholder}
                      className={`w-full border-4 border-[#333333] rounded-2xl px-5 py-3 md:py-4 font-bold text-[#333333] text-sm md:text-base focus:ring-4 focus:ring-[#FFD166] transition-all outline-none ${
                        errors[field.id]
                          ? "bg-red-50 border-red-500"
                          : "bg-white"
                      }`}
                    />
                    {errors[field.id] && (
                      <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-tighter">
                        ⚠️ {errors[field.id]}
                      </p>
                    )}
                  </div>
                ))}

                <div>
                  <label className="block text-[10px] md:text-xs font-black text-[#333333] uppercase tracking-widest mb-2">
                    Complete Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    rows={3}
                    className="w-full border-4 border-[#333333] rounded-2xl px-5 py-4 font-bold text-[#333333] bg-white focus:ring-4 focus:ring-[#FFD166] transition-all outline-none text-sm md:text-base"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-tighter">
                      ⚠️ {errors.address}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FF8C42] hover:bg-[#E86A33] text-white py-5 rounded-2xl md:rounded-[1.5rem] font-black text-xl md:text-2xl shadow-[0px_8px_0px_#E86A33] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-3 uppercase tracking-tighter disabled:opacity-50 disabled:cursor-not-allowed border-2 border-[#333333]"
                >
                  {isSubmitting ? "Placing Order..." : "Get My Dabba →"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Small helper for the checkmark
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="4"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-[#F9F7F0] flex flex-col items-center justify-center">
      <div className="animate-bounce mb-4 text-4xl">🍱</div>
      <p className="font-black text-[#333333] uppercase tracking-widest">
        Prepping Checkout...
      </p>
    </div>
  );
}
