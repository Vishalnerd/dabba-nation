"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="flex items-center gap-2 bg-white border-4 border-[#333333] px-5 py-2 rounded-2xl font-black text-[#333333] shadow-[4px_4px_0px_#333333] hover:bg-red-50 hover:text-red-500 transition-all active:shadow-none active:translate-y-1"
    >
      <LogOut size={20} />
      <span>EXIT CABINET</span>
    </button>
  );
}
