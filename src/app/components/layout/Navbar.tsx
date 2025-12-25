"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-green-700/95 backdrop-blur-md shadow-lg py-3"
          : "bg-green-700 shadow-md py-4"
      } border-b border-green-100`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110 group-hover:rotate-12 shadow-lg">
              <span className="text-white font-bold text-lg">DN</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-green-100 transition-colors">
              Dabba Nation
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="#plans"
              className="text-white hover:text-green-100 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-green-600/50"
            >
              Plans
            </a>
            <a
              href="#why-choose-us"
              className="text-white hover:text-green-100 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-green-600/50"
            >
              Why Us
            </a>
            <Link
              href="/components/admin"
              className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Admin
            </Link>
            <a
              href="#plans"
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-xl flex items-center space-x-2 group"
            >
              <span>Order Now</span>
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-green-600/50 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-green-600/30 backdrop-blur-sm rounded-lg p-4 space-y-2 border border-green-500/30">
            <a
              href="#plans"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-white hover:text-green-100 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-green-600/50"
            >
              Plans
            </a>
            <a
              href="#why-choose-us"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-white hover:text-green-100 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-green-600/50"
            >
              Why Us
            </a>
            <Link
              href="/components/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-white hover:text-green-100 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-green-600/50"
            >
              Admin
            </Link>
            <a
              href="#plans"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block bg-green-600 hover:bg-green-500 text-white px-4 py-3 rounded-lg text-center font-semibold transition-all duration-200 shadow-md"
            >
              Order Now
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
