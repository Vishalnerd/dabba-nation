"use client";

import PlanCard from "./PlanCard";
import { useEffect, useState } from "react";

export default function PlansSection() {
  const [isVisible, setIsVisible] = useState(false);

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

    const section = document.getElementById("plans");
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
      id="plans"
      className="relative py-20 bg-gradient-to-br from-green-50 via-white to-green-50/50 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-100 rounded-full opacity-20 -translate-x-32 -translate-y-32 animate-pulse"></div>
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-green-200 rounded-full opacity-15 translate-x-24 animate-pulse delay-300"></div>
      <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-green-100 rounded-full opacity-25 translate-y-16 animate-bounce delay-700"></div>

      {/* Floating decorative icons */}
      <div className="absolute top-20 right-20 opacity-10 animate-float">
        <svg
          className="w-20 h-20 text-green-300"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      </div>

      <div className="absolute bottom-32 left-10 opacity-10 animate-float delay-500">
        <svg
          className="w-16 h-16 text-green-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path
            fillRule="evenodd"
            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <div
        className={`relative z-10 max-w-7xl mx-auto px-6 text-center transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Section badge */}
        <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-green-100 to-green-50 text-green-800 text-sm font-semibold mb-6 shadow-sm border border-green-200/50 animate-fade-in">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Affordable Meal Plans
        </div>

        {/* Main heading */}
        <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up delay-100">
          <span className="text-gray-800">Our </span>
          <span className="text-green-700 relative inline-block">
            Tiffin Plans
            <svg
              className="absolute -bottom-1 left-0 w-full h-2.5 text-green-200"
              viewBox="0 0 100 8"
              fill="currentColor"
            >
              <path d="M0 6c20 0 30-4 50-4s30 4 50 4v2H0z" />
            </svg>
          </span>
        </h2>

        <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
          Simple, homely, and budget-friendly meals delivered daily.
        </p>

        {/* Value proposition badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 animate-fade-in-up delay-300">
          {[
            "No Hidden Charges",
            "Flexible Cancellation",
            "Daily Fresh Meals",
          ].map((text, index) => (
            <div
              key={index}
              className="flex items-center text-green-700 bg-white px-5 py-2.5 rounded-full shadow-md border border-green-100 hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-semibold">{text}</span>
            </div>
          ))}
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto mb-16">
          <div className="animate-fade-in-up delay-400">
            <PlanCard title="Monthly Tiffin" price={1950} planId="monthly" />
          </div>
          <div className="md:-mt-6 animate-fade-in-up delay-500">
            <PlanCard
              title="Weekly Tiffin"
              price={455}
              planId="weekly"
              isPopular={true}
            />
          </div>
          <div className="animate-fade-in-up delay-600">
            <PlanCard title="Trial Tiffin" price={70} planId="trial" />
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="relative max-w-3xl mx-auto animate-fade-in-up delay-700">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl opacity-20 blur-lg"></div>

          <div className="relative bg-white rounded-2xl shadow-xl border-2 border-green-100 p-8 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center md:justify-start">
                  <span className="text-3xl mr-2">🤔</span>
                  Not sure which plan to choose?
                </h3>
                <p className="text-gray-600">
                  Start with our trial tiffin and experience the taste of
                  home-cooked meals
                </p>
              </div>
              <button className="group bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center space-x-2 whitespace-nowrap">
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>Get Help Choosing</span>
              </button>
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
            transform: translateY(-15px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
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

        .delay-600 {
          animation-delay: 600ms;
        }

        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </section>
  );
}
