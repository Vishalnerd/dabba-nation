"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ChefHat } from "lucide-react";
import Toast from "../../components/ui/Toast";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setToast({ message: "Invalid Admin Credentials!", type: "error" });
      setLoading(false);
    } else {
      setToast({ message: "Welcome Back, Chef!", type: "success" });
      setTimeout(() => router.push("/admin/dashboard"), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F0] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#FFD166] rounded-full opacity-20 -translate-x-32 -translate-y-32"></div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white border-4 border-[#333333] rounded-[2.5rem] p-8 md:p-10 shadow-[12px_12px_0px_#333333]">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FF8C42] rounded-2xl border-4 border-[#333333] shadow-[4px_4px_0px_#333333] mb-6 rotate-[-5deg]">
              <ChefHat className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-[#333333] uppercase tracking-tighter">
              Admin <span className="text-[#FF8C42]">Portal</span>
            </h1>
            <p className="text-gray-500 font-bold text-sm">
              Authorized Dabba-Managers Only
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[#333333] mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin_name"
                  className="w-full bg-[#F9F7F0] border-4 border-[#333333] rounded-2xl pl-12 pr-4 py-4 font-bold outline-none focus:ring-4 focus:ring-[#FFD166] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[#333333] mb-2">
                Security Key
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F9F7F0] border-4 border-[#333333] rounded-2xl pl-12 pr-4 py-4 font-bold outline-none focus:ring-4 focus:ring-[#FFD166] transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#333333] text-white py-5 rounded-2xl font-black text-xl shadow-[0px_6px_0px_#FF8C42] active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Enter Kitchen →"}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-gray-400 font-bold text-xs uppercase tracking-widest">
          © 2026 DabbaNation Central Command
        </p>
      </div>
    </div>
  );
}
