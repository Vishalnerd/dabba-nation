"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface PlanCardProps {
  title: string;
  price: number;
  planId: string;
  isPopular?: boolean;
}

export default function PlanCard({
  title,
  price,
  planId,
  isPopular = false,
}: PlanCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleOrder = () => {
    router.push(`/checkout?plan=${planId}`);
  };

  const features = [
    { icon: "🍱", text: "Lunch + Dinner" },
    { icon: "🏠", text: "Home-style Meals" },
    { icon: "⏰", text: "On-Time Delivery" },
    { icon: "✨", text: "Fresh Daily" },
  ];

  const getDuration = () => {
    if (planId === "monthly") return "30 Days";
    if (planId === "weekly") return "7 Days";
    return "1 Day";
  };

  const getSavings = () => {
    if (planId === "monthly") return "Save ₹450";
    if (planId === "weekly") return "Best Value";
    return "Risk Free";
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 ${
        isPopular
          ? "border-green-500 shadow-2xl"
          : "border-green-100 hover:border-green-300 hover:shadow-xl"
      } ${isHovered ? "transform -translate-y-2" : ""}`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
          ⭐ Most Popular
        </div>
      )}

      {/* Glow effect for popular */}
      {isPopular && (
        <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl opacity-20 blur-xl"></div>
      )}

      <div className="relative z-10">
        {/* Plan Title */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
          <div className="inline-block bg-green-50 text-green-700 px-4 py-1 rounded-full text-sm font-semibold">
            {getDuration()}
          </div>
        </div>

        {/* Price */}
        <div className="text-center mb-6 pb-6 border-b border-gray-100">
          <div className="flex items-baseline justify-center">
            <span className="text-5xl font-bold text-green-700">₹{price}</span>
            <span className="text-gray-500 ml-2">
              / {planId === "trial" ? "day" : planId}
            </span>
          </div>
          <div className="mt-2 text-sm font-semibold text-green-600">
            {getSavings()}
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li
              key={index}
              className={`flex items-center text-gray-700 transition-all duration-300 delay-${
                index * 100
              } ${isHovered ? "translate-x-2" : ""}`}
            >
              <span className="text-2xl mr-3">{feature.icon}</span>
              <span className="font-medium">{feature.text}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button
          onClick={handleOrder}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
            isPopular
              ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg hover:shadow-xl"
              : "bg-green-700 hover:bg-green-800 text-white hover:shadow-lg"
          } ${
            isHovered ? "scale-105" : ""
          } flex items-center justify-center space-x-2 group`}
        >
          <span>Order Now</span>
          <svg
            className={`w-5 h-5 transform transition-transform ${
              isHovered ? "translate-x-1" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>

        {/* Money-back guarantee or feature note */}
        <p className="text-center text-xs text-gray-500 mt-4">
          {planId === "trial"
            ? "💯 100% Satisfaction Guaranteed"
            : "🔄 Flexible Cancellation"}
        </p>
      </div>
    </div>
  );
}
