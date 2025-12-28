// app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState, memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Toast from "../../../components/ui/Toast";
import { useAdminAuth } from "@/lib/useAuth";

type Meal = {
  delivered: boolean;
  deliveredAt?: string;
};

type Order = {
  orderId: string;
  package: "daily" | "weekly" | "monthly";
  totalAmount: number;
  customer: {
    name: string;
    phone: string;
    address: string;
    pincode: string;
  };
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
  };
  paymentStatus: string;
  createdAt: string;
};

type Analytics = {
  ordersToday: number;
  ordersThisWeek: number;
  revenueByPackage: { package: string; revenue: number; count: number }[];
  packagePopularity: { package: string; count: number; percentage: number }[];
  dailyGrowth: { date: string; orders: number; revenue: number }[];
  totalRevenue: number;
  totalRevenueToday: number;
  totalRevenueThisWeek: number;
};

export default function AdminDashboard() {
  // Verify JWT token and redirect if invalid
  useAdminAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [packageFilter, setPackageFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : "";

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/components/admin");
  };

  const calculateAnalytics = (ordersData: Order[]): Analytics => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 🔒 CRITICAL: Only count PAID orders in analytics
    const paidOrders = ordersData.filter((o) => o.paymentStatus === "paid");

    // Orders today and this week
    const ordersToday = paidOrders.filter(
      (o) => new Date(o.createdAt) >= today
    ).length;
    const ordersThisWeek = paidOrders.filter(
      (o) => new Date(o.createdAt) >= weekAgo
    ).length;

    // Revenue calculations
    const revenueMap = new Map<string, { revenue: number; count: number }>();
    let totalRevenue = 0;
    let totalRevenueToday = 0;
    let totalRevenueThisWeek = 0;

    paidOrders.forEach((order) => {
      const pkg = order.package || "Unknown";
      const amount = order.totalAmount || 0;
      const orderDate = new Date(order.createdAt);

      // Total revenue
      totalRevenue += amount;

      // Revenue by time period
      if (orderDate >= today) totalRevenueToday += amount;
      if (orderDate >= weekAgo) totalRevenueThisWeek += amount;

      // Revenue by package
      const current = revenueMap.get(pkg) || { revenue: 0, count: 0 };
      revenueMap.set(pkg, {
        revenue: current.revenue + amount,
        count: current.count + 1,
      });
    });

    const revenueByPackage = Array.from(revenueMap.entries())
      .map(([pkg, data]) => ({
        package: pkg,
        revenue: data.revenue,
        count: data.count,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // Package popularity
    const packagePopularity = revenueByPackage.map((item) => ({
      package: item.package,
      count: item.count,
      percentage:
        paidOrders.length > 0 ? (item.count / paidOrders.length) * 100 : 0,
    }));

    // Daily growth (last 7 days) - only paid orders
    const dailyGrowth: { date: string; orders: number; revenue: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
      const dayOrders = paidOrders.filter((o) => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= date && orderDate < nextDate;
      });
      dailyGrowth.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      });
    }

    return {
      ordersToday,
      ordersThisWeek,
      revenueByPackage,
      packagePopularity,
      dailyGrowth,
      totalRevenue,
      totalRevenueToday,
      totalRevenueThisWeek,
    };
  };

  const fetchOrders = async (page = currentPage) => {
    console.log("Orders:", orders);

    setLoading(true);
    // 3️⃣ PAGINATION: Include page and limit parameters
    const res = await fetch(`/api/admin/orders?page=${page}&limit=20`, {
      headers: { Authorization: `Bearer ${token || ""}` },
    });
    const data = await res.json();
    if (data.success) {
      setOrders(data.orders);
      setAnalytics(calculateAnalytics(data.orders));
      if (data.pagination) {
        setPagination(data.pagination);
      }
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    await fetchOrders();
    setToast({ message: "Orders and analytics refreshed", type: "success" });
    setTimeout(() => setToast(null), 3000);
  };

  const markMeal = async (
    orderId: string,
    meal: "breakfast" | "lunch" | "dinner"
  ) => {
    try {
      // 🔒 Check payment status before allowing meal marking
      const order = orders.find((o) => o.orderId === orderId);
      if (order && order.paymentStatus !== "paid") {
        setToast({
          message: "Cannot mark meal - Payment not confirmed",
          type: "error",
        });
        setTimeout(() => setToast(null), 3000);
        return;
      }

      const res = await fetch("/api/admin/orders/mark-meal", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ orderId, meal }),
      });

      const data = await res.json();
      if (data.success) {
        // 5️⃣ OPTIMIZE: Update state locally instead of re-fetching
        setOrders((prev) =>
          prev.map((o) =>
            o.orderId === orderId
              ? {
                  ...o,
                  meals: {
                    ...o.meals,
                    [meal]: {
                      delivered: true,
                      deliveredAt: new Date().toISOString(),
                    },
                  },
                }
              : o
          )
        );
        setToast({ message: `${meal} marked as delivered`, type: "success" });
      } else {
        setToast({
          message: data.error || "Failed to mark meal",
          type: "error",
        });
      }
    } catch (err: any) {
      setToast({ message: err.message || "Error marking meal", type: "error" });
    }
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders based on search term and filters
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPackage =
      packageFilter === "" || order.package === packageFilter;

    // 🔒 CRITICAL: Only show paid orders (backend already filters, but double-check)
    const isPaid = order.paymentStatus === "paid";

    return matchesSearch && matchesPackage && isPaid;
  });

  // Get unique packages from orders
  const uniquePackages = Array.from(
    new Set(orders.map((order) => order.package))
  ).sort();

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading orders...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg sm:text-xl">
                  DN
                </span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Admin Dashboard
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Manage all orders
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={handleRefresh}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
              <div className="text-left sm:text-right bg-green-50 px-4 py-2 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-500">Total Orders</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {orders.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Dashboard */}
        {analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            {/* Orders Today */}
            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">
                    📊 Orders Today
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">
                    {analytics.ordersToday}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ₹{analytics.totalRevenueToday.toLocaleString()} revenue
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Orders This Week */}
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">
                    📊 Orders This Week
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                    {analytics.ordersThisWeek}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ₹{analytics.totalRevenueThisWeek.toLocaleString()} revenue
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">
                    💰 Total Revenue
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                    ₹{analytics.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {orders.length} orders
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Average Order Value */}
            <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">
                    💵 Avg Order Value
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-orange-600">
                    ₹
                    {orders.length > 0
                      ? Math.round(
                          analytics.totalRevenue / orders.length
                        ).toLocaleString()
                      : 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">per order</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revenue by Package & Package Popularity */}
        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {/* Revenue by Package */}
            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">💰</span>
                Revenue by Package
              </h2>
              <div className="space-y-3">
                {analytics.revenueByPackage.map((item, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-100 pb-3 last:border-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-700">
                        {item.package}
                      </span>
                      <span className="text-green-600 font-bold">
                        ₹{item.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{item.count} orders</span>
                      <span>
                        ₹
                        {Math.round(item.revenue / item.count).toLocaleString()}{" "}
                        avg
                      </span>
                    </div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-green-600 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            (item.revenue / analytics.totalRevenue) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Package Popularity */}
            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📦</span>
                Package Popularity
              </h2>
              <div className="space-y-3">
                {analytics.packagePopularity.map((item, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-100 pb-3 last:border-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-700">
                        {item.package}
                      </span>
                      <span className="text-blue-600 font-bold">
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                      <span>{item.count} orders</span>
                      <span>
                        {item.count} / {orders.length}
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.percentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Growth Trend Chart */}
        {analytics && (
          <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📈</span>
              7-Day Growth Trend
            </h2>
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <div className="min-w-[500px] grid grid-cols-7 gap-2">
                {analytics.dailyGrowth.map((day, index) => {
                  const maxOrders = Math.max(
                    ...analytics.dailyGrowth.map((d) => d.orders)
                  );
                  const maxRevenue = Math.max(
                    ...analytics.dailyGrowth.map((d) => d.revenue)
                  );
                  const heightPercentage =
                    maxOrders > 0 ? (day.orders / maxOrders) * 100 : 0;

                  return (
                    <div key={index} className="text-center">
                      <div className="mb-2 h-48 flex flex-col justify-end">
                        <div
                          className="bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg transition-all duration-500 hover:from-green-700 hover:to-green-500 cursor-pointer relative group"
                          style={{
                            height: `${heightPercentage}%`,
                            minHeight: day.orders > 0 ? "20px" : "0px",
                          }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {day.orders} orders
                            <br />₹{day.revenue.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-gray-600 mb-1">
                        {day.date}
                      </div>
                      <div className="text-sm font-bold text-green-600">
                        {day.orders}
                      </div>
                      <div className="text-xs text-gray-500">
                        ₹{day.revenue > 0 ? (day.revenue / 1000).toFixed(1) : 0}
                        k
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-600 rounded mr-2"></div>
                  <span className="text-gray-600">Orders</span>
                </div>
              </div>
              <div className="text-gray-500">
                Total:{" "}
                {analytics.dailyGrowth.reduce((sum, d) => sum + d.orders, 0)}{" "}
                orders | ₹
                {analytics.dailyGrowth
                  .reduce((sum, d) => sum + d.revenue, 0)
                  .toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden">
          {/* Search and Filter Section */}
          <div className="bg-gradient-to-r from-green-50 to-white p-4 sm:p-6 border-b border-green-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {/* Search Input */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search by Customer Name or Order ID
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                  />
                </div>
              </div>

              {/* Package Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter by Package
                </label>
                <select
                  value={packageFilter}
                  onChange={(e) => setPackageFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white cursor-pointer"
                >
                  <option value="">All Packages</option>
                  {uniquePackages.map((pkg) => (
                    <option key={pkg} value={pkg}>
                      {pkg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">{filteredOrders.length}</span> of{" "}
              <span className="font-semibold">{orders.length}</span> orders
            </div>
          </div>

          {/* Table - Desktop View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Package
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Address
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Meals
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, index) => (
                    <tr
                      key={order.orderId}
                      className={index % 2 === 0 ? "bg-white" : "bg-green-50"}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {order.orderId}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 capitalize">
                          {order.package || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">
                            {order.customer.name}
                          </p>
                          <p className="text-gray-500">
                            {order.customer.phone}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-gray-700">
                            {order.customer.address}
                          </p>
                          <p className="text-gray-500 text-xs">
                            PIN: {order.customer.pincode}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            order.paymentStatus === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {order.meals ? (
                          <div className="space-y-2">
                            <MealButton
                              label="Breakfast"
                              delivered={
                                order.meals.breakfast?.delivered || false
                              }
                              onClick={() =>
                                markMeal(order.orderId, "breakfast")
                              }
                            />
                            <MealButton
                              label="Lunch"
                              delivered={order.meals.lunch?.delivered || false}
                              onClick={() => markMeal(order.orderId, "lunch")}
                            />
                            <MealButton
                              label="Dinner"
                              delivered={order.meals.dinner?.delivered || false}
                              onClick={() => markMeal(order.orderId, "dinner")}
                            />
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">
                            No meals data
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Card View - Mobile/Tablet */}
          <div className="lg:hidden divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No orders found
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="p-4 hover:bg-green-50 transition-colors"
                >
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        {order.orderId}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 capitalize">
                          {order.package || "N/A"}
                        </span>
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                            order.paymentStatus === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="mb-3 pb-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {order.customer.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.customer.phone}
                    </p>
                  </div>

                  {/* Meals */}
                  {order.meals ? (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-600 mb-2">
                        Meal Status:
                      </p>
                      <MealButton
                        label="Breakfast"
                        delivered={order.meals.breakfast?.delivered || false}
                        onClick={() => markMeal(order.orderId, "breakfast")}
                      />
                      <MealButton
                        label="Lunch"
                        delivered={order.meals.lunch?.delivered || false}
                        onClick={() => markMeal(order.orderId, "lunch")}
                      />
                      <MealButton
                        label="Dinner"
                        delivered={order.meals.dinner?.delivered || false}
                        onClick={() => markMeal(order.orderId, "dinner")}
                      />
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">No meals data</span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-xl">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => {
                    const newPage = Math.max(1, currentPage - 1);
                    setCurrentPage(newPage);
                    fetchOrders(newPage);
                  }}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                    const newPage = Math.min(
                      pagination.totalPages,
                      currentPage + 1
                    );
                    setCurrentPage(newPage);
                    fetchOrders(newPage);
                  }}
                  disabled={currentPage === pagination.totalPages}
                  className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * pagination.limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        currentPage * pagination.limit,
                        pagination.total
                      )}
                    </span>{" "}
                    of <span className="font-medium">{pagination.total}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => {
                        const newPage = Math.max(1, currentPage - 1);
                        setCurrentPage(newPage);
                        fetchOrders(newPage);
                      }}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {Array.from(
                      { length: Math.min(5, pagination.totalPages) },
                      (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => {
                              setCurrentPage(pageNum);
                              fetchOrders(pageNum);
                            }}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                              currentPage === pageNum
                                ? "z-10 bg-green-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                                : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                    <button
                      onClick={() => {
                        const newPage = Math.min(
                          pagination.totalPages,
                          currentPage + 1
                        );
                        setCurrentPage(newPage);
                        fetchOrders(newPage);
                      }}
                      disabled={currentPage === pagination.totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

// 4️⃣ MEMOIZE: Prevent unnecessary re-renders
const MealButton = memo(function MealButton({
  label,
  delivered,
  onClick,
}: {
  label: string;
  delivered: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={delivered}
      className={`w-full px-3 py-2 rounded-lg text-sm font-semibold
        ${
          delivered
            ? "bg-green-100 text-green-700 cursor-not-allowed"
            : "bg-orange-100 text-orange-800 hover:bg-orange-200"
        }`}
    >
      {label}: {delivered ? "Delivered ✅" : "Pending ⏳"}
    </button>
  );
});
