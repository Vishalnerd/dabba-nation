"use client";

import { useEffect, useState } from "react";

const reasons = [
  {
    icon: "🍱",
    title: "Homemade Food",
    description:
      "Authentic recipes prepared with love, just like your grandmother's cooking",
    highlight: "100% Traditional",
    color: "from-orange-400 to-orange-600",
  },
  {
    icon: "✨",
    title: "Hygienic Kitchen",
    description:
      "ISO certified kitchen with highest standards of cleanliness and food safety",
    highlight: "ISO Certified",
    color: "from-blue-400 to-blue-600",
  },
  {
    icon: "🚚",
    title: "On-time Delivery",
    description:
      "Punctual delivery service ensuring your meals arrive fresh and on schedule",
    highlight: "99% On-Time",
    color: "from-green-400 to-green-600",
  },
];

export default function WhyChooseUs() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById("why-choose-us");
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  return (
    <section
      id="why-choose-us"
      className="relative bg-gray-200 py-20 md:py-24 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full opacity-20 translate-x-40 -translate-y-40 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-200 rounded-full opacity-15 -translate-x-32 translate-y-32 animate-pulse delay-300"></div>
      <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-green-400 rounded-full opacity-30 animate-bounce"></div>
      <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-green-300 rounded-full opacity-25 animate-bounce delay-500"></div>
      <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-green-500 rounded-full opacity-20 animate-ping"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-block mb-4">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-green-50 text-green-700 text-sm font-semibold border border-green-200 shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Our Promise to You
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-green-500 to-green-400">
              Dabba Nation
            </span>
            ?
          </h2>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're committed to delivering not just food, but the warmth and
            comfort of home-cooked meals
          </p>
        </div>

        {/* Reasons grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {reasons.map((reason, index) => (
            <div
              key={reason.title}
              className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-green-100 transition-all duration-700 cursor-pointer overflow-hidden ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-20"
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 150}ms` : "0ms",
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Gradient overlay on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${reason.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              ></div>

              {/* Icon container */}
              <div className="relative mb-6 text-center">
                <div
                  className={`inline-flex w-20 h-20 items-center justify-center rounded-2xl bg-gradient-to-br ${
                    reason.color
                  } text-white text-4xl shadow-lg transform transition-all duration-500 ${
                    hoveredIndex === index
                      ? "scale-110 rotate-6"
                      : "scale-100 rotate-0"
                  }`}
                >
                  <span>{reason.icon}</span>
                </div>

                {/* Highlight badge */}
                <div
                  className={`absolute -top-2 -right-4 sm:-right-2 transition-all duration-500 ${
                    hoveredIndex === index
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 -translate-y-2 scale-75"
                  }`}
                >
                  <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-green-600 to-green-500 text-white text-xs font-bold shadow-lg">
                    {reason.highlight}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="relative text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 group-hover:text-green-700 transition-colors duration-300">
                  {reason.title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-6 text-sm sm:text-base">
                  {reason.description}
                </p>

                {/* Decorative line */}
                <div
                  className={`h-1 rounded-full mx-auto bg-gradient-to-r ${
                    reason.color
                  } transition-all duration-500 ${
                    hoveredIndex === index ? "w-20" : "w-12"
                  }`}
                ></div>
              </div>

              {/* Corner decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                <div
                  className={`absolute top-0 right-0 w-full h-full bg-gradient-to-br ${
                    reason.color
                  } rounded-bl-full transform transition-all duration-500 ${
                    hoveredIndex === index ? "scale-100" : "scale-0"
                  }`}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom testimonial or stat */}
        <div
          className={`mt-16 sm:mt-20 bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl border border-green-200 max-w-5xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-8">
            <div className="text-center md:text-left flex-1">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
                Join 500+ Happy Customers
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Experience the difference of authentic home-cooked meals
              </p>
            </div>

            <div className="flex items-center gap-6">
              {/* Customer avatars */}
              <div className="flex -space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-300 to-green-400 rounded-full border-3 border-white shadow-md transform hover:scale-110 transition-transform duration-300"></div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-3 border-white shadow-md transform hover:scale-110 transition-transform duration-300"></div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full border-3 border-white shadow-md transform hover:scale-110 transition-transform duration-300"></div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-full border-3 border-white shadow-md flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-sm font-bold">500+</span>
                </div>
              </div>

              <div className="flex flex-col items-center bg-green-50 px-4 py-3 rounded-xl border border-green-200">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 fill-current text-yellow-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-green-700 font-bold text-lg">4.8/5</span>
                <span className="text-gray-500 text-xs">Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
