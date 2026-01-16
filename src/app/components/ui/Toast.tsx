"use client";

import { useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

type ToastProps = {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
};

export default function Toast({
  message,
  type = "success",
  onClose,
}: ToastProps) {
  // Auto-close after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: {
      bg: "bg-[#A3D9A5]", // Our brand Mint
      shadow: "shadow-[6px_6px_0px_#333333]",
      icon: <CheckCircle2 className="w-5 h-5 text-[#333333]" />,
    },
    error: {
      bg: "bg-[#FF8C42]", // Our brand Orange/Coral
      shadow: "shadow-[6px_6px_0px_#333333]",
      icon: <AlertCircle className="w-5 h-5 text-[#333333]" />,
    },
  };

  const currentStyle = styles[type];

  return (
    <div
      className={`fixed top-6 right-6 z-[100] px-6 py-4 rounded-2xl border-4 border-[#333333] transition-all animate-in slide-in-from-right-10 
        ${currentStyle.bg} ${currentStyle.shadow}`}
    >
      <div className="flex items-center space-x-4">
        <div className="bg-white/40 p-1.5 rounded-lg border-2 border-[#333333]">
          {currentStyle.icon}
        </div>

        <span className="text-[#333333] font-black uppercase text-sm tracking-tight">
          {message}
        </span>

        <button
          onClick={onClose}
          className="hover:scale-125 transition-transform p-1 rounded-full hover:bg-black/10"
        >
          <X className="w-5 h-5 text-[#333333]" strokeWidth={3} />
        </button>
      </div>

      {/* Playful progress bar at the bottom */}
      <div className="absolute bottom-1 left-4 right-4 h-1 bg-[#333333]/20 rounded-full overflow-hidden">
        <div className="h-full bg-[#333333] animate-toast-progress"></div>
      </div>
    </div>
  );
}
