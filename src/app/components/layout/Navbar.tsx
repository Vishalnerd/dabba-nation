"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ShieldCheck } from "lucide-react"; // Added ShieldCheck icon

const scrollToSection = (id: string, setOpen?: (open: boolean) => void) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    if (setOpen) setOpen(false);
  }
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "Plans", id: "plans" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-[100] transition-all duration-300 border-b-4 border-[#333333]/10 
      ${
        isOpen || scrolled
          ? "bg-[#F9F7F0] shadow-md"
          : "bg-[#F9F7F0] md:bg-[#F9F7F0]/90 md:backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 md:py-4 flex items-center justify-between">
        {/* Logo Section */}
        <Link
          href="/"
          className="flex items-center gap-2 cursor-pointer group z-[110]"
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
          <h1 className="text-xl sm:text-2xl font-black text-[#333333] tracking-tight">
            Dabba<span className="text-[#FF8C42]">Nation</span>
          </h1>
        </Link>

        {/* DESKTOP Navigation Links */}
        <div className="hidden md:block">
          <ul className="flex space-x-6 lg:space-x-8 items-center">
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
              <Link href="/components/about">About</Link>
              <span className="absolute bottom-[-4px] left-0 w-0 h-1 bg-[#FFD166] rounded-full transition-all group-hover:w-full"></span>
            </li>

            {/* ADMIN BUTTON (Desktop) */}
            <li>
              <Link
                href="/admin/login"
                className="flex items-center gap-1.5 text-[#333333]/60 hover:text-[#333333] font-bold text-sm transition-colors border-2 border-transparent hover:border-[#333333]/10 px-3 py-1 rounded-lg"
              >
                <ShieldCheck size={18} />
                Admin
              </Link>
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
          className="md:hidden z-[110] p-2 rounded-xl bg-white border-2 border-[#333333] shadow-[3px_3px_0px_#333333] active:shadow-none active:translate-y-1 transition-all"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X size={24} strokeWidth={4} className="text-[#333333]" />
          ) : (
            <Menu size={24} strokeWidth={4} className="text-[#333333]" />
          )}
        </button>
      </div>

      {/* MOBILE Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[#FFD166] z-[105] flex flex-col items-center justify-center md:hidden transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className="flex flex-col space-y-6 text-center px-6">
          {navLinks.map((item) => (
            <li
              key={item.label}
              onClick={() => scrollToSection(item.id, setIsOpen)}
              className="text-4xl font-black text-[#333333] uppercase tracking-tighter cursor-pointer hover:text-white"
            >
              {item.label}
            </li>
          ))}
          <li className="text-4xl font-black text-[#333333] uppercase tracking-tighter">
            <Link href="/components/about" onClick={() => setIsOpen(false)}>
              About
            </Link>
          </li>

          {/* ADMIN LINK (Mobile) */}
          <li className="text-2xl font-bold text-[#333333]/70 uppercase tracking-tighter py-2 border-t-2 border-[#333333]/10">
            <Link
              href="/admin/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2"
            >
              <ShieldCheck size={24} /> Admin Access
            </Link>
          </li>

          <li className="pt-4">
            <button
              onClick={() => scrollToSection("plans", setIsOpen)}
              className="bg-[#FF8C42] text-white px-10 py-4 rounded-2xl font-black text-2xl shadow-[6px_6px_0px_#333333] active:translate-y-2 active:shadow-none transition-all border-4 border-[#333333]"
            >
              ORDER NOW
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
