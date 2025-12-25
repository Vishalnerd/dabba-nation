"use client";

import { useEffect, useState } from "react";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="pt-20 md:pt-24 min-h-screen flex items-center bg-gradient-to-br from-[#f5f3ea] via-green-50/45 to-[#f5f3ea] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full opacity-20 -translate-y-32 translate-x-32 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-green-200 rounded-full opacity-15 translate-y-24 -translate-x-24 animate-pulse delay-700"></div>
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-green-50 rounded-full opacity-30 animate-bounce delay-300"></div>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div
            className={`relative z-10 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-green-50 text-green-800 text-sm font-medium mb-6 shadow-sm border border-green-200/50 animate-fade-in">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Fresh & Homemade Daily
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-6">
              <span className="text-green-700 inline-block animate-fade-in-up">
                Ghar jaisa
              </span>{" "}
              <span className="inline-block animate-fade-in-up delay-100">
                khana,
              </span>
              <br />
              <span className="relative inline-block animate-fade-in-up delay-200">
                roz bina tension.
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-green-200"
                  viewBox="0 0 200 12"
                  fill="currentColor"
                >
                  <path d="M0 8c40 0 60-6 100-6s60 6 100 6v4H0z" />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg leading-relaxed animate-fade-in-up delay-300">
              Experience the comfort of home-cooked meals delivered fresh to
              your doorstep. Authentic flavors, healthy ingredients, zero
              hassle.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-400">
              <a
                href="#plans"
                className="group border-2 border-green-600 text-green-300 hover:bg-green-50 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-7 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                  />
                </svg>
                <span>View Plans</span>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-green-200/50 animate-fade-in-up delay-500">
              <div className="text-center transform hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold text-green-300 mb-1">
                  500+
                </div>
                <div className="text-sm text-gray-300">Happy Customers</div>
              </div>
              <div className="text-center transform hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold text-green-300 mb-1">
                  24/7
                </div>
                <div className="text-sm text-gray-300">Fresh Delivery</div>
              </div>
              <div className="text-center transform hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold text-green-300 mb-1">
                  100%
                </div>
                <div className="text-sm text-gray-300">Homemade</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div
            className={`relative z-10 order-first md:order-last transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-6 bg-gradient-to-br from-green-300 via-green-200 to-green-100 rounded-3xl opacity-30 blur-2xl animate-pulse"></div>

              {/* Main image container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-3xl">
                <div className="relative aspect-[4/3] md:aspect-square">
                  <img
                    src="/hero-1.jpg"
                    alt="Delicious homemade food with authentic flavors"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl transform hover:scale-110 transition-transform duration-300 animate-float">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-gradient-to-br from-green-300 to-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-800">4.8</div>
                    <div className="text-yellow-500 text-xs">★★★★★</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl transform hover:scale-110 transition-transform duration-300 animate-float delay-500">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-ping absolute"></div>
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">
                      Live Cooking
                    </div>
                    <div className="text-xs text-gray-600">Fresh & Hot</div>
                  </div>
                </div>
              </div>

              {/* Decorative dots */}
              <div className="absolute top-1/4 -left-8 w-16 h-16 bg-green-100 rounded-full opacity-50 animate-bounce"></div>
              <div className="absolute bottom-1/4 -right-8 w-20 h-20 bg-green-200 rounded-full opacity-40 animate-bounce delay-300"></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .delay-100 {
          animation-delay: 100ms;
        }

        .delay-200 {
          animation-delay: 200ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        .delay-400 {
          animation-delay: 400ms;
        }

        .delay-500 {
          animation-delay: 500ms;
        }

        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </section>
  );
}
