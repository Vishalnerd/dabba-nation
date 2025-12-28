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
  const initialStatus = searchParams.get("status");
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string>(
    initialStatus || "pending"
  );

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
          setPaymentStatus(data.order.paymentStatus);
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

  // Poll for payment status updates if payment is pending
  useEffect(() => {
    if (
      !orderId ||
      !order ||
      paymentStatus === "paid" ||
      paymentStatus === "success"
    )
      return;

    const pollInterval = setInterval(async () => {
      try {
        console.log("Polling for payment status update...");
        const response = await fetch(`/api/orders/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          const newStatus = data.order.paymentStatus;
          console.log("Current payment status:", newStatus);

          if (newStatus !== paymentStatus) {
            setPaymentStatus(newStatus);
            setOrder(data.order);

            // Stop polling when payment is confirmed
            if (newStatus === "paid" || newStatus === "success") {
              console.log("✅ Payment confirmed by webhook!");
              clearInterval(pollInterval);
            }
          }
        }
      } catch (err) {
        console.error("Error polling payment status:", err);
      }
    }, 3000); // Poll every 3 seconds

    // Stop polling after 5 minutes
    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
      console.log("Stopped polling after 5 minutes");
    }, 300000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [orderId, order, paymentStatus]);

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
            {/* Title */}
            <div className="text-center mb-8">
              {paymentStatus === "paid" || paymentStatus === "success" ? (
                <>
                  <div className="inline-block mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-75"></div>
                      <div className="relative bg-green-500 text-white text-5xl rounded-full w-20 h-20 flex items-center justify-center">
                        ✓
                      </div>
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    Payment Successful! 🎉
                  </h1>
                  <p className="text-gray-600">
                    Your order has been confirmed and will be processed shortly.
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-block mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-amber-200 rounded-full animate-pulse"></div>
                      <div className="relative bg-amber-500 text-white text-5xl rounded-full w-20 h-20 flex items-center justify-center">
                        ⏳
                      </div>
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    Payment Pending ⏳
                  </h1>
                  <p className="text-gray-600">
                    We're verifying your payment. This usually takes a few
                    seconds.
                  </p>
                  <div className="mt-4 flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
                    <span className="text-sm text-amber-600 font-medium">
                      Verifying payment...
                    </span>
                  </div>
                </>
              )}
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
                  {paymentStatus === "paid" || paymentStatus === "success" ? (
                    <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Confirmed</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-200 text-amber-800 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <svg
                        className="w-4 h-4 animate-spin"
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
                      <span>Pending</span>
                    </span>
                  )}
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

            {/* Payment Pending Alert or What's Next */}
            {paymentStatus === "pending" ? (
              <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 mb-8">
                <div className="flex items-start space-x-3">
                  <svg
                    className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <h3 className="text-lg font-bold text-amber-800 mb-2">
                      Payment Verification in Progress
                    </h3>
                    <p className="text-amber-700 mb-3">
                      Your payment is being verified by our payment gateway.
                      This typically takes 10-30 seconds.
                    </p>
                    <ul className="space-y-2 text-sm text-amber-700">
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                        <span>Please do not close this page</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                        <span>We're automatically checking for updates</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                        <span>
                          You'll see a confirmation once payment is verified
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  What's Next?
                </h2>

                <ol className="space-y-3">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-500 text-white text-sm font-bold mr-3 flex-shrink-0">
                      1
                    </span>
                    <span className="text-gray-700">
                      You'll receive a confirmation SMS shortly
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-500 text-white text-sm font-bold mr-3 flex-shrink-0">
                      2
                    </span>
                    <span className="text-gray-700">
                      Our team will contact you to finalize meal preferences
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-500 text-white text-sm font-bold mr-3 flex-shrink-0">
                      3
                    </span>
                    <span className="text-gray-700">
                      Deliveries will start from the next business day
                    </span>
                  </li>
                </ol>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/")}
                className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg font-semibold transition-colors"
              >
                Back to Home
              </button>
              <a
                href={`https://wa.me/${
                  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
                }?text=${encodeURIComponent(
                  `Hi, I need help with my order.\n\nName: ${
                    order.customer.name
                  }\nOrder ID: ${order.orderId}\nPlan Type: ${
                    order.package.charAt(0).toUpperCase() +
                    order.package.slice(1)
                  }`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors text-center flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
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
