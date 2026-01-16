"use client";

import React from "react";
import { Heart, ShieldCheck, Leaf, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";

const values = [
  {
    title: "Purely Homemade",
    desc: "No massive base gravies. Every meal is cooked fresh, just like in your own kitchen.",
    icon: <Heart className="w-8 h-8 text-[#FF8C42]" />,
    color: "bg-[#FFD166]",
  },
  {
    title: "Hygiene First",
    desc: "Our kitchens are cleaner than a whistle. We prioritize your health above all else.",
    icon: <ShieldCheck className="w-8 h-8 text-[#FF8C42]" />,
    color: "bg-[#A3D9A5]",
  },
  {
    title: "Zero Waste",
    desc: "We use eco-friendly packaging and optimized portions to reduce food waste.",
    icon: <Leaf className="w-8 h-8 text-[#FF8C42]" />,
    color: "bg-[#FFD166]",
  },
  {
    title: "Rocket Delivery",
    desc: "Rain or shine, our Dabba-runners ensure your lunch hits your desk on time.",
    icon: <Rocket className="w-8 h-8 text-[#FF8C42]" />,
    color: "bg-[#A3D9A5]",
  },
];

export default function AboutPage() {
  const router = useRouter();

  const handleGetDabba = () => {
    router.push("/#plans");
  };

  return (
    <div className="bg-[#F9F7F0] min-h-screen pt-24 pb-12 overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="px-6 py-8 md:py-16 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 lg:gap-16">
        {/* Text Container */}
        <div className="w-full md:w-1/2 text-center md:text-left order-2 md:order-1">
          <span className="bg-[#FF8C42] text-white px-4 py-1.5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest mb-6 inline-block shadow-[4px_4px_0px_#333333] border-2 border-[#333333]">
            Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#333333] leading-[1.1] mb-6">
            Feeding the <span className="text-[#FF8C42]">Nation</span>,{" "}
            <br className="hidden lg:block" /> One Dabba at a time.
          </h1>
          <p className="text-base md:text-lg text-gray-700 font-bold leading-relaxed mb-6">
            DabbaNation started with a simple problem: Delhi is full of amazing
            people, but finding a meal that tastes like home shouldn't be a
            struggle.
          </p>
          <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed max-w-2xl">
            We aren't a massive corporate cloud kitchen. We are a community of
            chefs and food lovers dedicated to bringing the authentic taste of
            Indian households to students in PGs and busy office professionals.
            No additives, no excessive oil—just pure, honest nutrition.
          </p>
        </div>

        {/* Image Container */}
        <div className="w-full md:w-1/2 relative order-1 md:order-2 px-4 md:px-0">
          <div className="absolute inset-0 bg-[#FFD166] rounded-[2.5rem] md:rounded-[3rem] rotate-3 -z-0 border-4 border-[#333333]"></div>
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop"
            alt="Healthy Tiffin Meal"
            className="relative z-10 w-full rounded-[2.5rem] md:rounded-[3rem] border-4 border-[#333333] shadow-[10px_10px_0px_#333333] -rotate-2 hover:rotate-0 transition-transform duration-500 aspect-square object-cover"
          />
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="bg-[#333333] py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter italic">
              Why Choose <span className="text-[#FFD166]">DabbaNation?</span>
            </h2>
            <p className="text-[#A3D9A5] font-black text-xs md:text-sm uppercase tracking-widest">
              More than just a tiffin service—it's a lifestyle.
            </p>
          </div>

          {/* Grid: 1 on mobile, 2 on tablet, 4 on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((v, i) => (
              <div
                key={i}
                className={`${v.color} p-6 md:p-8 rounded-[2rem] border-4 border-[#333333] shadow-[8px_8px_0px_rgba(255,255,255,0.1)] hover:translate-y-[-8px] transition-all duration-300`}
              >
                <div className="bg-white w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border-4 border-[#333333] mb-6 shadow-[4px_4px_0px_#333333]">
                  {v.icon}
                </div>
                <h3 className="text-lg md:text-xl font-black text-[#333333] mb-3 uppercase tracking-tighter">
                  {v.title}
                </h3>
                <p className="text-[#333333] font-bold text-xs md:text-sm leading-relaxed opacity-90">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 md:py-32 text-center px-4 md:px-6">
        <div className="bg-[#FF8C42] max-w-5xl mx-auto p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border-4 border-[#333333] shadow-[12px_12px_0px_#333333] relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter italic leading-none">
            Ready to taste <br className="md:hidden" /> the magic?
          </h2>
          <p className="text-white font-bold text-base md:text-2xl mb-10 opacity-90 max-w-2xl mx-auto leading-tight">
            Join 500+ members enjoying healthy home-cooked meals every day.
          </p>
          <button
            onClick={handleGetDabba}
            className="w-full sm:w-auto bg-white text-[#333333] px-10 py-5 rounded-2xl font-black text-lg md:text-xl shadow-[6px_6px_0px_#333333] hover:shadow-none hover:translate-y-1 active:translate-y-2 transition-all uppercase tracking-widest border-2 border-[#333333]"
          >
            GET YOUR DABBA NOW
          </button>
        </div>
      </section>
    </div>
  );
}
