"use client";

import { useState } from "react";

export default function Footer() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  return (
    <footer className="relative bg-green-700 border-t border-green-600 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-green-100 rounded-full opacity-20 -translate-x-20 -translate-y-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-200 rounded-full opacity-15 translate-x-16 translate-y-16 animate-pulse delay-300"></div>
      <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-green-300 rounded-full opacity-20 animate-bounce"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-10">
          {/* Brand section */}
          <div className="col-span-1 sm:col-span-2">
            <div className="flex items-center space-x-3 mb-4 group">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <span className="text-white font-bold text-xl">DN</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Dabba Nation
              </h3>
            </div>
            <p className="text-green-100 mb-6 max-w-md leading-relaxed text-sm sm:text-base">
              Bringing the comfort of home-cooked meals to your doorstep. Fresh,
              hygienic, and delicious tiffin service in Delhi.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <div className="flex items-center text-green-100 group hover:text-white transition-colors duration-300">
                <div className="p-2 bg-green-600 rounded-lg mr-3 group-hover:bg-green-500 transition-colors duration-300">
                  <svg
                    className="w-4 h-4 text-green-200"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-sm sm:text-base">
                  Nehru Place & nearby areas
                </span>
              </div>
              <div className="flex items-center text-green-100 group hover:text-white transition-colors duration-300">
                <div className="p-2 bg-green-600 rounded-lg mr-3 group-hover:bg-green-500 transition-colors duration-300">
                  <svg
                    className="w-4 h-4 text-green-200"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <span className="text-sm sm:text-base">Order on WhatsApp</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#plans"
                  className="group flex items-center text-green-100 hover:text-white transition-all duration-300 text-sm sm:text-base"
                  onMouseEnter={() => setHoveredLink("plans")}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <span
                    className={`inline-block w-0 h-0.5 bg-green-300 mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300`}
                  ></span>
                  Tiffin Plans
                </a>
              </li>

              <li>
                <a
                  href="#contact"
                  className="group flex items-center text-green-100 hover:text-white transition-all duration-300 text-sm sm:text-base"
                  onMouseEnter={() => setHoveredLink("contact")}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <span
                    className={`inline-block w-0 h-0.5 bg-green-300 mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300`}
                  ></span>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Service Info */}
          <div>
            <h4 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
              Service Hours
            </h4>
            <div className="space-y-3">
              <div className="bg-green-600 rounded-lg p-3 sm:p-4 border border-green-500 hover:border-green-400 transition-all duration-300 hover:shadow-lg group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🍱</span>
                    <span className="text-sm sm:text-base font-medium text-green-100 group-hover:text-white transition-colors duration-300">
                      Lunch
                    </span>
                  </div>
                  <span className="text-sm sm:text-base text-white font-semibold">
                    12–2 PM
                  </span>
                </div>
              </div>
              <div className="bg-green-600 rounded-lg p-3 sm:p-4 border border-green-500 hover:border-green-400 transition-all duration-300 hover:shadow-lg group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🍛</span>
                    <span className="text-sm sm:text-base font-medium text-green-100 group-hover:text-white transition-colors duration-300">
                      Dinner
                    </span>
                  </div>
                  <span className="text-sm sm:text-base text-white font-semibold">
                    7–9 PM
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-green-200 mt-3 flex items-center">
                <span className="w-1.5 h-1.5 bg-green-300 rounded-full mr-2 animate-pulse"></span>
                Monday to Saturday
              </p>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-green-600">
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-6 mb-4 md:mb-0">
            <p className="text-xs sm:text-sm text-green-100">
              © 2025 Dabba Nation. All rights reserved.
            </p>
            <div className="flex items-center text-green-200 group hover:text-white transition-colors duration-300">
              <svg
                className="w-4 h-4 mr-1.5 animate-pulse"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs sm:text-sm font-medium">
                Made with love in Delhi
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center text-green-200 bg-green-600 px-4 py-2 rounded-full border border-green-500 shadow-md hover:shadow-lg hover:bg-green-500 transition-all duration-300 group">
              <div className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium group-hover:text-white transition-colors duration-300">
                Fresh & Available
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
