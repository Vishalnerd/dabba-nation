"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeactivateButtonProps {
  orderId: string;
}

export default function DeactivateButton({ orderId }: DeactivateButtonProps) {
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDeactivate = async () => {
    setIsDeactivating(true);
    try {
      const response = await fetch("/api/orders/deactivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh the page to show updated list
        router.refresh();
      } else {
        alert(data.error || "Failed to deactivate order");
      }
    } catch (err) {
      alert("Failed to deactivate order");
    } finally {
      setIsDeactivating(false);
      setShowConfirm(false);
    }
  };

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="w-full bg-red-500 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-2 border-2 border-[#333333] shadow-[4px_4px_0px_#333333] hover:shadow-none hover:translate-y-1"
      >
        <Trash2 className="w-4 h-4" />
        DEACTIVATE
      </button>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <p className="text-xs font-bold text-red-600 text-center">
        Are you sure?
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleDeactivate}
          disabled={isDeactivating}
          className="flex-1 bg-red-500 text-white px-3 py-2 rounded-xl font-black text-xs hover:bg-red-600 transition-colors flex items-center justify-center gap-1 disabled:opacity-50 border-2 border-[#333333]"
        >
          {isDeactivating ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            "YES"
          )}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isDeactivating}
          className="flex-1 bg-gray-300 text-[#333333] px-3 py-2 rounded-xl font-black text-xs hover:bg-gray-400 transition-colors disabled:opacity-50 border-2 border-[#333333]"
        >
          NO
        </button>
      </div>
    </div>
  );
}
