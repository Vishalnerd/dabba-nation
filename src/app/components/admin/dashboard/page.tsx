// app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "../../../components/ui/Toast";

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

    // Orders today and this week
    const ordersToday = ordersData.filter(
      (o) => new Date(o.createdAt) >= today
    ).length;
    const ordersThisWeek = ordersData.filter(
      (o) => new Date(o.createdAt) >= weekAgo
    ).length;

    // Revenue calculations
    const revenueMap = new Map<string, { revenue: number; count: number }>();
    let totalRevenue = 0;
    let totalRevenueToday = 0;
    let totalRevenueThisWeek = 0;

    ordersData.forEach((order) => {
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
      percentage: (item.count / ordersData.length) * 100,
    }));

    // Daily growth (last 7 days)
    const dailyGrowth: { date: string; orders: number; revenue: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
      const dayOrders = ordersData.filter((o) => {
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

  const fetchOrders = async () => {
    console.log("Orders:", orders);

    setLoading(true);
    const res = await fetch("/api/admin/orders", {
      headers: { "x-admin-token": token || "" },
    });
    const data = await res.json();
    if (data.success) {
      setOrders(data.orders);
      setAnalytics(calculateAnalytics(data.orders));
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
      const res = await fetch("/api/admin/orders/mark-meal", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token || "",
        },
        body: JSON.stringify({ orderId, meal }),
      });

      const data = await res.json();
      if (data.success) {
        fetchOrders();
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

    return matchesSearch && matchesPackage;
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
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">DN</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">Manage all orders</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={handleRefresh}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
              >
                <svg
                  className="w-5 h-5"
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
                <span>Refresh</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
              >
                <svg
                  className="w-5 h-5"
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
                <span>Logout</span>
              </button>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-green-600">
                  {orders.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Dashboard */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Orders Today */}
            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    📊 Orders Today
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {analytics.ordersToday}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ₹{analytics.totalRevenueToday.toLocaleString()} revenue
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
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
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    📊 Orders This Week
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {analytics.ordersThisWeek}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ₹{analytics.totalRevenueThisWeek.toLocaleString()} revenue
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
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
            <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    💰 Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    ₹{analytics.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {orders.length} orders
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-purple-600"
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
            <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    💵 Avg Order Value
                  </p>
                  <p className="text-3xl font-bold text-orange-600">
                    ₹
                    {orders.length > 0
                      ? Math.round(
                          analytics.totalRevenue / orders.length
                        ).toLocaleString()
                      : 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">per order</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-orange-600"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue by Package */}
            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
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
            <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
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
          <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📈</span>
              7-Day Growth Trend
            </h2>
            <div className="grid grid-cols-7 gap-2">
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
                      ₹{day.revenue > 0 ? (day.revenue / 1000).toFixed(1) : 0}k
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm">
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
          <div className="bg-gradient-to-r from-green-50 to-white p-6 border-b border-green-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          {/* Table */}
          <div className="overflow-x-auto">
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
                      colSpan={5}
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

function MealButton({
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
}
