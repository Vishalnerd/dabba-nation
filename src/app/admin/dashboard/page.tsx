import connectDB from "@/lib/db";
import Order from "@/models/Order";
import LogoutButton from "@/app/components/ui/LogoutButton";
import OrderList from "../OrderList/page";

export default async function AdminDashboard() {
  await connectDB();
  // Fetch from DB
  const rawOrders = await Order.find({
    active: true,
    endDate: { $gte: new Date() },
  }).sort({ endDate: 1 });

  // Convert Mongoose objects to plain JSON for Client Component
  const orders = JSON.parse(JSON.stringify(rawOrders));
  return (
    <div className="min-h-screen bg-[#F9F7F0] p-4 md:p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* UPDATED HEADER WITH LOGOUT */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-[#333333] uppercase tracking-tighter italic">
              Active <span className="text-[#FF8C42]">Dabba-ites</span>
            </h1>
            <p className="text-gray-500 font-bold mt-1 uppercase text-xs tracking-widest">
              DabbaNation Command Center
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block bg-white border-4 border-[#333333] px-6 py-2 rounded-2xl shadow-[4px_4px_0px_#333333] font-black text-[#333333]">
              Total: {orders.length}
            </div>
            <LogoutButton />
          </div>
        </div>
        <OrderList initialOrders={orders} />
      </div>
    </div>
  );
}
