"use client";
import PlanFlipCard from "../ui/PlanFlipCard";

const plans = [
  {
    id: "weekly",
    title: "Weekly Warrior",
    subtitle: "Stress-free work weeks",
    price: "490",
    duration: "Week",
    color: "#A3D9A5", // Mint Green
    features: [
      "Daily sabzi changes",

      "4-week rotating menu",

      "Balanced portions with roti, sabzi, dal & rice",

      "Weekly & monthly plans only",
    ],
    tag: "Most Popular",
    href: "/checkout?plan=weekly",
  },
  {
    id: "monthly",
    title: "The Legend",
    subtitle: "The ultimate peace of mind",
    price: "1950",
    duration: "Month",
    color: "#FF8C42", // Orange
    features: [
      "Daily sabzi changes",

      "4-week rotating menu",

      "Balanced portions with roti, sabzi, dal & rice",

      "Weekly & monthly plans only",
    ],
    tag: "Best Value",
    href: "/checkout?plan=monthly",
  },
];

export default function PlansSection() {
  return (
    <section
      id="plans"
      className="py-16 md:py-24 px-6 md:px-8 bg-[#F9F7F0] w-full overflow-hidden"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Heading - Responsive Text Sizes */}
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#333333] mb-4 leading-tight">
            Pick Your <span className="text-[#FF8C42]">Dabba Plan</span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto font-medium">
            No hidden fees. No long-term commitments.{" "}
            <br className="hidden md:block" />
            Switch or cancel your plan anytime!
          </p>
        </div>

        {/* Plans Grid - Centered layout for 2 cards */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch justify-center max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="relative group w-full lg:w-[400px] flex-shrink-0"
            >
              {/* Playful Tag - Adjusted for better visibility on small screens */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 bg-[#333333] text-white text-[10px] md:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[4px_4px_0px_rgba(0,0,0,0.2)] whitespace-nowrap border-2 border-white">
                {plan.tag}
              </div>

              <PlanFlipCard
                href={plan.href}
                title={plan.title}
                price={plan.price}
                duration={plan.duration}
                color={plan.color}
                features={plan.features}
                // Optional: pass a highlighted prop for the "Weekly" plan
                highlighted={plan.id === "weekly"}
              />
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white/50 border-2 border-dashed border-gray-300 rounded-2xl px-6 py-3">
            <p className="text-sm text-gray-700 font-bold italic">
              🍱 Need something bigger? Custom corporate/bulk plans available
              upon request.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
