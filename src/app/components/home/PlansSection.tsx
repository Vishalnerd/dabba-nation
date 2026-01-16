"use client";
import PlanFlipCard from "../ui/PlanFlipCard";

const plans = [
  {
    id: "trial",
    title: "The Teaser",
    subtitle: "Perfect for a taste test",
    price: "99",
    duration: "Day",
    color: "#FFD166", // Yellow
    features: ["1 Full Meal", "Fresh Phulkas", "Dessert Included"],
    tag: "Newbie Friendly",
    href: "/checkout?plan=trial",
  },
  {
    id: "weekly",
    title: "Weekly Warrior",
    subtitle: "Stress-free work weeks",
    price: "599",
    duration: "Week",
    color: "#A3D9A5", // Mint Green
    features: [
      "6 Days (Mon-Sat)",
      "Free Delivery",
      "Menu Variety",
      "Skip Anytime",
    ],
    tag: "Most Popular",
    href: "/checkout?plan=weekly",
  },
  {
    id: "monthly",
    title: "The Legend",
    subtitle: "The ultimate peace of mind",
    price: "2199",
    duration: "Month",
    color: "#FF8C42", // Orange
    features: [
      "24 Full Meals",
      "Priority Delivery",
      "Sunday Surprise Sweet",
      "24/7 Support",
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

        {/* Plans Grid - Handling Mobile, Tablet, and Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-6 lg:gap-x-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative group ${
                // Center the third card on tablet screens (sm to lg)
                plan.id === "monthly"
                  ? "sm:col-span-2 lg:col-span-1 sm:max-w-md sm:mx-auto lg:w-full"
                  : ""
              }`}
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
            <p className="text-sm text-gray-500 font-bold italic">
              🍱 Need something bigger? Custom corporate/bulk plans available
              upon request.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
