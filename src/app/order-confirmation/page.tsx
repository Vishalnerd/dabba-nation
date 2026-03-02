"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { CheckCircle2, PhoneCall, Utensils, MessageSquare } from "lucide-react";
import { format } from "date-fns"; // We'll use this for the start date

interface OrderDetails {
  orderId: string;
  customer: {
    name: string; // Ensure your API returns 'name', not 'fullName'
    phone: string;
    address: string;
    pincode: string;
  };
  package: string;
  totalAmount: number;
  startDate?: string; // Added startDate
  paymentStatus: string; // Good to check if it's actually paid
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    const fetchOrder = async (retryCount = 0) => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data.order);
          setLoading(false);
        } else if (response.status === 404 && retryCount < 5) {
          // Retry logic is great for waiting on webhooks!
          setTimeout(() => fetchOrder(retryCount + 1), 1500);
        } else {
          setError(true);
          setLoading(false);
        }
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F0] flex flex-col items-center justify-center p-6">
        <div className="animate-bounce mb-4 text-5xl md:text-6xl text-center">
          🍱
        </div>
        <p className="font-black text-[#333333] uppercase tracking-widest text-center animate-pulse">
          Confirming Payment...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#F9F7F0] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-black text-[#333333] mb-4">Oops! 🧐</h2>
        <p className="font-bold text-gray-600 mb-6">
          We couldn't find order details for #{orderId}
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-8 py-3 bg-[#FF8C42] text-white rounded-2xl font-black border-4 border-[#333333]"
        >
          GO TO HOME
        </button>
      </div>
    );
  }

  // Determine when the first meal arrives based on the selected startDate
  const formattedStartDate = order.startDate
    ? format(new Date(order.startDate), "EEEE, do MMM")
    : "Tomorrow";

  // Create prefilled WhatsApp message
  const whatsappMessage = encodeURIComponent(
    `Hi DabbaNation! 🍱\n\n` +
      `I've just placed an order and wanted to confirm the details:\n\n` +
      `📝 Order ID: ${order.orderId}\n` +
      `👤 Name: ${order.customer.name}\n` +
      `📦 Plan: ${order.package.toUpperCase()}\n` +
      `📅 Starts: ${formattedStartDate}\n` +
      `📍 Address: ${order.customer.address}, ${order.customer.pincode}\n` +
      `💰 Amount: ₹${order.totalAmount}\n\n` +
      `Looking forward to delicious meals!`,
  );

  return (
    <div className="min-h-screen bg-[#F9F7F0] relative overflow-hidden py-12 md:py-20 px-4 sm:px-6">
      {/* Playful Background Elements */}
      <div className="absolute top-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-[#FFD166] rounded-full opacity-20 -translate-x-24 -translate-y-24 md:-translate-x-32 md:-translate-y-32"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-[#FF8C42] rounded-full opacity-10 translate-x-24 translate-y-24 md:translate-x-32 md:translate-y-32"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* SUCCESS HEADER */}
        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border-4 border-[#333333] p-6 md:p-12 text-center shadow-[8px_8px_0px_rgba(0,0,0,0.1)] mb-8 relative">
          {/* If payment is still pending (webhook hasn't fired yet) */}
          {order.paymentStatus === "pending" && (
            <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-black uppercase border-2 border-yellow-400">
              Payment Processing...
            </div>
          )}

          <div className="inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-[#A3D9A5] rounded-full border-4 border-[#333333] shadow-[4px_4px_0px_#333333] mb-6 animate-[pulse_2s_ease-in-out_infinite]">
            <CheckCircle2
              className="w-8 h-8 md:w-12 md:h-12 text-[#333333]"
              strokeWidth={3}
            />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-[#333333] mb-4 uppercase tracking-tighter leading-tight italic">
            Yum! Order <span className="text-[#FF8C42]">Confirmed</span>
          </h1>
          <p className="text-base md:text-xl font-bold text-gray-500 max-w-md mx-auto leading-tight">
            Payment successful! Our chef is sharpening their knives.
          </p>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* WHAT HAPPENS NEXT */}
          <div className="bg-[#FFD166] rounded-[1.5rem] md:rounded-[2rem] border-4 border-[#333333] p-6 md:p-8 shadow-[6px_6px_0px_#333333] md:shadow-[8px_8px_0px_#333333]">
            <h2 className="text-xl md:text-2xl font-black text-[#333333] mb-6 uppercase italic tracking-tighter">
              What's Next?
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="bg-white p-2 h-10 w-10 rounded-xl border-2 border-[#333333] flex-shrink-0 flex items-center justify-center shadow-[2px_2px_0px_#333333]">
                  <PhoneCall className="w-5 h-5 text-[#FF8C42]" />
                </div>
                <p className="font-bold text-[#333333] leading-tight text-sm md:text-base">
                  Our manager will call you shortly to confirm your diet vibe
                  (Veg/Non-Veg).
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-white p-2 h-10 w-10 rounded-xl border-2 border-[#333333] flex-shrink-0 flex items-center justify-center shadow-[2px_2px_0px_#333333]">
                  <Utensils className="w-5 h-5 text-[#FF8C42]" />
                </div>
                <p className="font-bold text-[#333333] leading-tight text-sm md:text-base">
                  Your first hot Dabba will be delivered on{" "}
                  <span className="bg-white px-1 rounded border border-[#333333] underline decoration-[#FF8C42] decoration-2">
                    {formattedStartDate}
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] border-4 border-[#333333] p-6 md:p-8 shadow-[6px_6px_0px_rgba(0,0,0,0.1)] md:shadow-[8px_8px_0px_rgba(0,0,0,0.1)] flex flex-col justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-[#333333] mb-6 uppercase tracking-tighter">
                Receipt
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between border-b-2 border-dashed border-gray-200 pb-2">
                  <span className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">
                    Order ID
                  </span>
                  <span className="font-black text-[#333333] text-sm">
                    #{order.orderId.slice(-6)}
                  </span>
                </div>
                <div className="flex justify-between border-b-2 border-dashed border-gray-200 pb-2">
                  <span className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">
                    Plan
                  </span>
                  <span className="font-black text-[#FF8C42] uppercase text-sm">
                    {order.package}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">
                    Total Paid
                  </span>
                  <span className="font-black text-xl md:text-2xl text-[#333333]">
                    ₹{order.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t-4 border-[#333333]">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">
                Delivering To
              </p>
              <p className="font-black text-[#333333] leading-tight text-sm md:text-base">
                {order.customer.name}
              </p>
              <p className="text-xs md:text-sm font-bold text-gray-500 mt-1 line-clamp-2 italic">
                {order.customer.address}, {order.customer.pincode}
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM BUTTONS */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => router.push("/")}
            className="w-full sm:w-auto px-10 py-4 bg-[#333333] text-white rounded-2xl font-black uppercase tracking-widest shadow-[4px_4px_0px_#FF8C42] hover:translate-y-1 hover:shadow-none transition-all text-sm md:text-base border-2 border-[#333333]"
          >
            BACK TO KITCHEN
          </button>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-10 py-4 bg-white text-[#25D366] rounded-2xl font-black uppercase tracking-widest shadow-[4px_4px_0px_#25D366] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2 text-sm md:text-base border-4 border-[#25D366]"
          >
            <MessageSquare className="w-5 h-5 fill-[#25D366]" />
            WHATSAPP SUPPORT
          </a>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<OrderLoading />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}

function OrderLoading() {
  return (
    <div className="min-h-screen bg-[#F9F7F0] flex flex-col items-center justify-center p-6">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#FF8C42]"></div>
      <p className="mt-4 font-black text-[#333333] uppercase">
        Fetching your dabba details...
      </p>
    </div>
  );
}
