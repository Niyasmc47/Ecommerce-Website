import { useEffect, useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import { getOrders } from "../../services/adminService";
import type { AdminOrder } from "../../types/admin";
import { Link } from "react-router-dom";
import { BsEye, BsBox, BsTruck, BsCheck2Circle, BsArrowRepeat, BsHourglass, BsPerson } from "react-icons/bs";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  Pending:         { label: "Pending",          color: "bg-amber-500/10 text-amber-600 border-amber-500/20",     icon: <BsHourglass size={10} /> },
  Assigned:        { label: "Assigned",         color: "bg-blue-500/10 text-blue-600 border-blue-500/20",        icon: <BsPerson size={10} /> },
  OutForDelivery:  { label: "Out for Delivery", color: "bg-violet-500/10 text-violet-600 border-violet-500/20",  icon: <BsTruck size={10} /> },
  Delivered:       { label: "Delivered",         color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: <BsCheck2Circle size={10} /> },
  ReturnRequested: { label: "Return Requested", color: "bg-orange-500/10 text-orange-600 border-orange-500/20",  icon: <BsArrowRepeat size={10} /> },
  Returned:        { label: "Returned",          color: "bg-rose-500/10 text-rose-600 border-rose-500/20",        icon: <BsBox size={10} /> },
  Cancelled:       { label: "Cancelled",         color: "bg-red-500/10 text-red-600 border-red-500/20",           icon: <BsBox size={10} /> }, // Using BsBox or similar
};

const ALL_STATUSES = ["All", "Pending", "Assigned", "OutForDelivery", "Delivered", "ReturnRequested", "Returned", "Cancelled"];

function getStatusBadge(status: string) {
  const config = STATUS_CONFIG[status];
  if (!config) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-widest bg-surface border border-border text-foreground/70">
        {status}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-widest border ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    async function load() {
      try {
        const data = await getOrders();
        setOrders(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredOrders = activeFilter === "All"
    ? orders
    : orders.filter((o) => o.status === activeFilter);

  const statusCounts = ALL_STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = s === "All" ? orders.length : orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  if (loading) {
    return (
       <AdminLayout>
         <div className="flex h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
               <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
               <span className="font-mono text-xs uppercase tracking-widest text-primary animate-pulse">Loading Orders...</span>
            </div>
         </div>
       </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-10">
        <div className="mb-10">
           <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
             Orders
           </h1>
           <p className="text-foreground/50 font-mono mt-2 uppercase tracking-widest text-sm">Monitor & manage orders</p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {ALL_STATUSES.map((s) => {
            const label = s === "All" ? "All" : (STATUS_CONFIG[s]?.label ?? s);
            const isActive = activeFilter === s;
            return (
              <button
                key={s}
                onClick={() => setActiveFilter(s)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-surface border border-border text-foreground/60 hover:border-primary/40 hover:text-primary"
                }`}
              >
                {label}
                <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-background text-foreground/50"
                }`}>
                  {statusCounts[s] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border border-border bg-surface shadow-sm premium-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-background/50 font-mono text-xs uppercase text-foreground/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Order ID</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Customer</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Value</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Date</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-foreground/40">
                        <BsBox size={32} />
                        <p className="font-mono text-xs uppercase tracking-widest">No orders found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-background/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-foreground/50">#{order.id}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{order.customerName}</td>
                      <td className="px-6 py-4 font-bold text-foreground">₹{order.totalAmount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 text-foreground/70">
                        {new Date(order.createdDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-xs font-bold text-primary transition hover:bg-primary hover:text-white"
                        >
                          <BsEye size={14} /> View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
