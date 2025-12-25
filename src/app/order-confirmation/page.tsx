"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

interface OrderDetails {
  orderId: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    pincode: string;
  };
  package: string;
  totalAmount: number;
  paymentStatus: string;
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    // Fetch order details with retry logic
    const fetchOrder = async (retryCount = 0) => {
      try {
        console.log("Fetching order:", orderId, "Attempt:", retryCount + 1);
        const response = await fetch(`/api/orders/${orderId}`);

        if (response.ok) {
          const data = await response.json();
          console.log("Order found:", data.order);
          setOrder(data.order);
          setLoading(false);
        } else if (response.status === 404 && retryCount < 5) {
          // Retry if order not found (might be a timing issue)
          console.log("Order not found, retrying in 1 second...");
          setTimeout(() => fetchOrder(retryCount + 1), 1000);
        } else {
          console.error("Failed to fetch order. Status:", response.status);
          setLoading(false);
          // Show error state instead of redirecting immediately
          setTimeout(() => router.push("/"), 5000);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        if (retryCount < 5) {
          console.log("Retrying fetch in 1 second...");
          setTimeout(() => fetchOrder(retryCount + 1), 1000);
        } else {
          setLoading(false);
          setTimeout(() => router.push("/"), 5000);
        }
      }
    };

    // Start fetching after a small delay to allow server to process
    setTimeout(() => fetchOrder(), 500);
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f3ea] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <svg
              className="animate-spin h-12 w-12 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f5f3ea] flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-md">
          <svg
            className="w-16 h-16 mx-auto text-red-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-2">
            We couldn't find your order details.
          </p>
          <p className="text-xs text-gray-500 mb-4 break-all font-mono">
            Order ID: {orderId}
          </p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f3ea] to-green-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-green-100 rounded-full opacity-20 -translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-green-200 rounded-full opacity-15 translate-x-24 translate-y-24"></div>

      <div className="relative z-10 pt-12 pb-12">
        <div className="max-w-2xl mx-auto px-6">
          {/* Success Section */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-green-100 mb-8">
            {/* Checkmark */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Payment Successful! 🎉
              </h1>
              <p className="text-gray-600">
                Your order has been confirmed and will be processed shortly.
              </p>
            </div>

            {/* Order Details */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Order Summary
              </h2>

              <div className="space-y-4">
                {/* Order ID */}
                <div className="flex justify-between items-center pb-4 border-b border-green-200">
                  <span className="text-gray-700 font-medium">Order ID</span>
                  <span className="text-gray-800 font-semibold">
                    {order.orderId}
                  </span>
                </div>

                {/* Plan Type */}
                <div className="flex justify-between items-center pb-4 border-b border-green-200">
                  <span className="text-gray-700 font-medium">Plan Type</span>
                  <span className="text-gray-800 font-semibold capitalize">
                    {order.package}
                  </span>
                </div>

                {/* Amount */}
                <div className="flex justify-between items-center pb-4 border-b border-green-200">
                  <span className="text-gray-700 font-medium">
                    Total Amount
                  </span>
                  <span className="text-lg text-green-700 font-bold">
                    ₹{order.totalAmount}
                  </span>
                </div>

                {/* Payment Status */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">
                    Payment Status
                  </span>
                  <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-semibold capitalize">
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Delivery Details
              </h2>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Delivery To:</p>
                  <p className="text-gray-800 font-semibold">
                    {order.customer.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Phone:</p>
                  <p className="text-gray-800 font-semibold">
                    {order.customer.phone}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Address:</p>
                  <p className="text-gray-800 font-semibold">
                    {order.customer.address}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Pincode:</p>
                  <p className="text-gray-800 font-semibold">
                    {order.customer.pincode}
                  </p>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                What's Next?
              </h2>

              <ol className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-500 text-white text-sm font-bold mr-3 flex-shrink-0">
                    1
                  </span>
                  <span className="text-gray-700">
                    You'll receive a confirmation SMS shortly
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-500 text-white text-sm font-bold mr-3 flex-shrink-0">
                    2
                  </span>
                  <span className="text-gray-700">
                    Our team will contact you to finalize meal preferences
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-500 text-white text-sm font-bold mr-3 flex-shrink-0">
                    3
                  </span>
                  <span className="text-gray-700">
                    Deliveries will start from the next business day
                  </span>
                </li>
              </ol>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/")}
                className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg font-semibold transition-colors"
              >
                Back to Home
              </button>
              <a
                href={`tel:${order.customer.phone}`}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-center"
              >
                Contact Support
              </a>
            </div>
          </div>

          {/* Security Note */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-green-100">
            <div className="flex items-start space-x-4">
              <svg
                className="w-6 h-6 text-green-600 mt-1 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="font-semibold text-gray-800">
                  Secure Transaction
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Your payment information is encrypted and secure. Your order
                  details have been saved in our system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f3ea] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
