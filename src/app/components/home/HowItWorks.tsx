"use client";
import React from "react";
import { ClipboardList, UtensilsCrossed, Bike } from "lucide-react";

const steps = [
  {
    title: "Pick Your Plan",
    desc: "Trial, Weekly, or Monthly – choose what fits your lifestyle.",
    icon: <ClipboardList className="w-8 h-8 text-[#333333]" />,
    bgColor: "bg-[#FFD166]",
  },
  {
    title: "Choose Your Vibe",
    desc: "Veg, Non-Veg, or Jain. Tell us your preference!",
    icon: <UtensilsCrossed className="w-8 h-8 text-[#333333]" />,
    bgColor: "bg-[#A3D9A5]",
  },
  {
    title: "Doorstep Delivery",
    desc: "Fresh, hot dabbas delivered to your office or hostel.",
    icon: <Bike className="w-8 h-8 text-[#333333]" />,
    bgColor: "bg-[#FF8C42]",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="py-16 md:py-24 bg-[#F9F7F0] px-4 sm:px-6 md:px-8 overflow-hidden w-full"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Title - Responsive Sizing */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-6xl font-black text-[#333333] mb-4 tracking-tighter uppercase italic">
            Getting Started is <span className="text-[#FF8C42]">Easy!</span>
          </h2>
          <div className="h-2 w-24 md:w-32 bg-[#FFD166] mx-auto rounded-full border-2 border-[#333333]"></div>
        </div>

        {/* Steps Container */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-y-20 md:gap-x-12">
          {/* Decorative Dotted Line (Desktop: Horizontal) */}
          <div className="hidden md:block absolute top-[45px] left-0 w-full h-1 border-t-4 border-dashed border-[#333333]/20 -z-0"></div>

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              {/* Icon Circle - Mobile Scaling */}
              <div
                className={`${step.bgColor} w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center border-4 border-[#333333] shadow-[6px_6px_0px_#333333] group-hover:shadow-[2px_2px_0px_#333333] group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-300`}
              >
                {step.icon}
              </div>

              {/* Step Number Badge */}
              <div className="mt-[-15px] bg-[#333333] text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg border-2 border-white rotate-[-5deg] group-hover:rotate-0 transition-transform">
                {index + 1}
              </div>

              {/* Text Content */}
              <h3 className="text-2xl md:text-3xl font-black text-[#333333] mt-6 mb-3 uppercase tracking-tighter">
                {step.title}
              </h3>
              <p className="text-[#333333]/70 font-bold text-sm md:text-base leading-relaxed max-w-[280px]">
                {step.desc}
              </p>

              {/* Mobile Connector Arrow (Vertical) */}
              {index !== steps.length - 1 && (
                <div className="md:hidden absolute -bottom-16 text-[#333333]/20 animate-bounce">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
