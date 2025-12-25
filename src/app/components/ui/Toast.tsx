"use client";

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
  return (
    <div
      className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all
        ${type === "success" ? "bg-green-600" : "bg-red-600"}`}
    >
      <div className="flex items-center space-x-4">
        <span>{message}</span>
        <button onClick={onClose} className="text-white text-xl leading-none">
          ×
        </button>
      </div>
    </div>
  );
}
