"use client";

import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  const handleGetDabba = () => {
    // Smooth scroll for internal link
    const element = document.getElementById("how-it-works");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative w-full min-h-screen bg-[#F9F7F0] pt-24 md:pt-32 pb-12 px-4 sm:px-6 md:px-12 flex flex-col md:flex-row items-center justify-between overflow-hidden"
    >
      {/* Left Content: Text & CTA */}
      <div className="w-full md:w-1/2 z-10 text-center md:text-left flex flex-col items-center md:items-start order-2 md:order-1 mt-12 md:mt-0">
        <span className="inline-block px-4 py-1 bg-[#FFD166] text-[#333333] font-bold rounded-full text-xs md:text-sm mb-4 rotate-[-2deg] shadow-[2px_2px_0px_#333333] border border-[#333333]">
          🍱 100+ Happy Dabba-ites
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-[#333333] leading-[1.1] mb-6 tracking-tight">
          Ghar Ka Khana, <br className="hidden sm:block" />
          <span className="text-[#FF8C42]">Away From Home.</span>
        </h1>

        <p className="text-base md:text-xl text-gray-600 mb-8 max-w-md leading-relaxed font-medium">
          Delicious, healthy, and pocket-friendly dabbas delivered straight to
          your desk or hostel. No more compromising on taste!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={handleGetDabba}
            className="bg-[#FF8C42] text-white px-8 py-4 rounded-2xl font-black text-lg shadow-[0px_6px_0px_#E86A33] hover:shadow-none hover:translate-y-1 active:translate-y-2 transition-all border-2 border-[#333333]"
          >
            See How It Works
          </button>
          <button
            onClick={() => router.push("/#plans")}
            className="bg-white border-4 border-[#333333] text-[#333333] px-8 py-4 rounded-2xl font-black text-lg shadow-[6px_6px_0px_#333333] hover:shadow-none hover:translate-y-1 transition-all"
          >
            View Plans
          </button>
        </div>
      </div>

      {/* Right Content: The Visuals */}
      <div className="w-full md:w-1/2 relative flex justify-center items-center order-1 md:order-2">
        {/* Background Decorative Blob - Smaller on mobile */}
        <div className="absolute w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-[#FFD166] rounded-full filter blur-3xl opacity-30 animate-pulse"></div>

        {/* The Hero Image Container */}
        <div className="relative z-10 animate-bounce-slow">
          <img
            src="/hero-illustration.svg"
            alt="Delicious Indian Tiffin"
            className="w-[240px] sm:w-[350px] md:w-[500px] h-auto drop-shadow-2xl rotate-[5deg] transition-transform"
          />

          {/* Playful Floating Badge - Responsive scaling */}
          <div className="absolute -top-4 -right-2 md:-right-4 bg-white border-4 border-[#333333] p-3 md:p-4 rounded-2xl shadow-[6px_6px_0px_#333333] rotate-[12deg]">
            <p className="text-xl md:text-2xl font-black text-[#FF8C42] leading-none">
              ₹69{" "}
              <span className="text-xs md:text-sm text-gray-400 font-bold block md:inline uppercase tracking-tighter">
                /start
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
