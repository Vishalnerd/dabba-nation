"use client";

import { Check, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
// Ensure your flip-card.css has: .perspective { perspective: 1000px; } and .preserve-3d { transform-style: preserve-3d; }

type Props = {
  title: string;
  price: string;
  duration: string;
  features: string[];
  href: string;
  highlighted?: boolean;
  color?: string; // Added to pass the custom card color (Yellow/Mint/Orange)
};

export default function PlanFlipCard({
  title,
  price,
  duration,
  features,
  href,
  highlighted = false,
  color = "#FFD166", // Default to our brand yellow
}: Props) {
  const [flipped, setFlipped] = useState(false);
  const router = useRouter();

  const handlePlanSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(href);
  };

  return (
    <div
      className="h-[420px] cursor-pointer group"
      style={{ perspective: "1000px" }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 ease-in-out
          ${highlighted ? "scale-[1.05]" : ""}
        `}
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT SIDE */}
        <div
          className="absolute inset-0 rounded-[2rem] p-8 flex flex-col justify-between items-center shadow-[8px_8px_0px_rgba(0,0,0,0.1)] border-4 border-[#333333]"
          style={{
            backgroundColor: color,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
          }}
        >
          <div className="mt-12 text-center">
            <h3 className="text-4xl font-black text-[#333333] uppercase leading-tight">
              {title}
            </h3>
            <div className="mt-4 bg-[#333333] text-white px-4 py-1 rounded-full text-sm font-bold inline-block">
              {duration} Plan
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="animate-bounce">
              <ArrowRight className="w-6 h-6 text-[#333333] rotate-90" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-[#333333]/60">
              Flip for details
            </p>
          </div>
        </div>

        {/* BACK SIDE */}
        <div
          className="absolute inset-0 bg-white border-4 border-[#333333] rounded-[2rem] p-8 flex flex-col shadow-[8px_8px_0px_#333333]"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="mb-4">
            <span className="text-sm font-black text-[#FF8C42] uppercase tracking-tighter">
              Pricing
            </span>
            <p className="text-5xl font-black text-[#333333]">₹{price}</p>
          </div>

          <h4 className="text-md font-bold text-[#333333] mb-4 flex items-center gap-2">
            <span className="w-6 h-1 bg-[#FFD166] rounded-full"></span>
            What’s inside?
          </h4>

          <ul className="flex-grow space-y-3">
            {features.map((f, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm font-semibold text-gray-700"
              >
                <div className="bg-[#A3D9A5] p-0.5 rounded-full mt-0.5">
                  <Check className="w-3 h-3 text-white" strokeWidth={4} />
                </div>
                {f}
              </li>
            ))}
          </ul>

          <button
            onClick={handlePlanSelect}
            className="w-full block text-center py-4 rounded-xl font-black text-white bg-[#FF8C42] shadow-[0px_4px_0px_#E86A33] hover:shadow-none hover:translate-y-[4px] transition-all"
          >
            SELECT PLAN
          </button>
        </div>
      </div>
    </div>
  );
}
