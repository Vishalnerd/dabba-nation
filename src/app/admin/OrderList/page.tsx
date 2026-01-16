"use client";

import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { Calendar, Clock, Search } from "lucide-react";
import DeactivateButton from "@/app/components/ui/DeactivateButton";

export default function OrderList({ initialOrders }: { initialOrders: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter logic: Checks if search term matches Name or Order ID
  const filteredOrders = initialOrders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.customer.name.toLowerCase().includes(searchLower) ||
      order.orderId.toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      {/* SEARCH BAR */}
      <div className="mb-8 relative max-w-xl">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Search by Name or Order ID (e.g. ORD-123)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border-4 border-[#333333] rounded-2xl pl-12 pr-4 py-4 font-bold outline-none focus:ring-4 focus:ring-[#FFD166] transition-all shadow-[4px_4px_0px_#333333]"
        />
        {searchTerm && (
          <div className="absolute right-14 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-gray-400">
            {filteredOrders.length} Found
          </div>
        )}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 gap-8">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order: any) => {
            const daysLeft = differenceInDays(
              new Date(order.endDate),
              new Date()
            );
            const isExpiringSoon = daysLeft <= 3;

            return (
              <div
                key={order.orderId}
                className="bg-white border-4 border-[#333333] p-6 rounded-[2.5rem] shadow-[8px_8px_0px_#333333] transition-transform hover:scale-[1.01] flex flex-col lg:flex-row justify-between gap-6 relative overflow-hidden"
              >
                {isExpiringSoon && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white px-10 py-1 rotate-45 translate-x-8 translate-y-4 text-[10px] font-black uppercase border-2 border-[#333333]">
                    Expiring Soon
                  </div>
                )}

                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#FFD166] border-2 border-[#333333] px-3 py-1 rounded-lg font-black text-xs uppercase tracking-widest">
                      {order.package}
                    </span>
                    <p className="text-gray-400 font-bold text-xs">
                      #{order.orderId.slice(-6)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#333333]">
                      {order.customer.name}
                    </h3>
                    <p className="text-sm font-bold text-gray-500 flex items-center gap-1 mt-1">
                      <span className="text-[#FF8C42]">📍</span>{" "}
                      {order.customer.address}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col justify-center gap-4 lg:border-l-4 lg:border-dashed lg:border-gray-100 lg:pl-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#A3D9A5] p-2 rounded-lg border-2 border-[#333333]">
                      <Calendar className="w-5 h-5 text-[#333333]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">
                        Starts On
                      </p>
                      <p className="font-bold text-[#333333]">
                        {format(new Date(order.startDate), "dd MMM yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`${
                        isExpiringSoon ? "bg-red-400" : "bg-[#FFD166]"
                      } p-2 rounded-lg border-2 border-[#333333]`}
                    >
                      <Clock className="w-5 h-5 text-[#333333]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">
                        Expires On
                      </p>
                      <p
                        className={`font-black ${
                          isExpiringSoon ? "text-red-500" : "text-[#333333]"
                        }`}
                      >
                        {format(new Date(order.endDate), "dd MMM yyyy")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center lg:items-end gap-3 min-w-[150px]">
                  <div
                    className={`px-4 py-2 rounded-xl border-2 border-[#333333] font-black text-sm shadow-[4px_4px_0px_#333333] ${
                      isExpiringSoon
                        ? "bg-red-100 text-red-600"
                        : "bg-[#F9F7F0] text-[#333333]"
                    }`}
                  >
                    {daysLeft > 0 ? `${daysLeft} Days Left` : "Last Day!"}
                  </div>
                  <a
                    href={`tel:${order.customer.phone}`}
                    className="w-full text-center bg-[#333333] text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-[#FF8C42] transition-colors"
                  >
                    CONTACT
                  </a>
                  <DeactivateButton orderId={order.orderId} />
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white border-4 border-dashed border-gray-300 p-20 rounded-[2.5rem] text-center">
            <p className="text-gray-400 font-black uppercase italic">
              No dabba-ites found with that name/ID...
            </p>
          </div>
        )}
      </div>
    </>
  );
}
