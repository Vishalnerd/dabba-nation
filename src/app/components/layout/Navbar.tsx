"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Import icons

const scrollToSection = (id: string, setOpen?: (open: boolean) => void) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    if (setOpen) setOpen(false); // Close menu on mobile after click
  }
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Home", id: "home", type: "scroll" },
    { label: "Plans", id: "plans", type: "scroll" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#F9F7F0]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b-4 border-[#333333]/10">
      {/* Logo Section */}
      <Link
        href="/"
        className="flex items-center gap-2 cursor-pointer group z-[60]"
      >
        <div className="bg-[#FF8C42] p-1.5 rounded-lg rotate-[-10deg] group-hover:rotate-0 transition-transform border-2 border-[#333333]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="4"
              y="8"
              width="16"
              height="12"
              rx="2"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M8 8V6C8 4.89543 8.89543 4 10 4H14C15.1046 4 16 4.89543 16 6V8"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-[#333333] tracking-tight">
          Dabba<span className="text-[#FF8C42]">Nation</span>
        </h1>
      </Link>

      {/* DESKTOP Navigation Links */}
      <div className="hidden md:block">
        <ul className="flex space-x-8 items-center">
          {navLinks.map((item) => (
            <li
              key={item.label}
              onClick={() => scrollToSection(item.id)}
              className="text-[#333333] font-bold hover:text-[#FF8C42] cursor-pointer transition-colors relative group"
            >
              {item.label}
              <span className="absolute bottom-[-4px] left-0 w-0 h-1 bg-[#FFD166] rounded-full transition-all group-hover:w-full"></span>
            </li>
          ))}
          <li className="text-[#333333] font-bold hover:text-[#FF8C42] cursor-pointer transition-colors relative group">
            <Link href="/about">About</Link>
            <span className="absolute bottom-[-4px] left-0 w-0 h-1 bg-[#FFD166] rounded-full transition-all group-hover:w-full"></span>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("plans")}
              className="bg-[#FF8C42] hover:bg-[#E86A33] text-white px-6 py-2 rounded-xl font-black shadow-[4px_4px_0px_#333333] active:translate-y-[2px] active:shadow-none transition-all"
            >
              Order Now
            </button>
          </li>
        </ul>
      </div>

      {/* MOBILE Hamburger Button */}
      <button
        className="md:hidden z-[60] p-2 text-[#333333]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X size={32} strokeWidth={3} />
        ) : (
          <Menu size={32} strokeWidth={3} />
        )}
      </button>

      {/* MOBILE Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[#FFD166] z-50 flex flex-col items-center justify-center transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className="flex flex-col space-y-8 text-center">
          {navLinks.map((item) => (
            <li
              key={item.label}
              onClick={() => scrollToSection(item.id, setIsOpen)}
              className="text-4xl font-black text-[#333333] uppercase tracking-tighter hover:text-white transition-colors cursor-pointer"
            >
              {item.label}
            </li>
          ))}
          <li className="text-4xl font-black text-[#333333] uppercase tracking-tighter hover:text-white transition-colors">
            <Link href="/components/about" onClick={() => setIsOpen(false)}>
              About
            </Link>
          </li>
          <li className="pt-4">
            <button
              onClick={() => scrollToSection("plans", setIsOpen)}
              className="bg-[#FF8C42] text-white px-10 py-4 rounded-2xl font-black text-2xl shadow-[6px_6px_0px_#333333] active:translate-y-2 active:shadow-none transition-all"
            >
              ORDER NOW
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
