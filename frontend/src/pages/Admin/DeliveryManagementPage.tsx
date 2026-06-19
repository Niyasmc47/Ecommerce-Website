import { useEffect, useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import {
  getDeliveryAgents,
  assignDeliveryAgent,
  getAllDeliveries,
} from "../../services/adminDeliveryService";
import toast from "react-hot-toast";
import { BsTruck, BsPerson, BsBox, BsCheck2Circle, BsHourglass, BsArrowRepeat } from "react-icons/bs";

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  Pending:         { label: "Pending",          classes: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  Assigned:        { label: "Assigned",         classes: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  OutForDelivery:  { label: "Out for Delivery", classes: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
  Delivered:       { label: "Delivered",        classes: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  ReturnRequested: { label: "Return Requested", classes: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  Returned:        { label: "Returned",         classes: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
  Cancelled:       { label: "Cancelled",        classes: "bg-red-500/10 text-red-600 border-red-500/20" },
};

const ALL_STATUSES = ["All", "Pending", "Assigned", "OutForDelivery", "Delivered", "ReturnRequested", "Returned", "Cancelled"];

export default function DeliveryManagementPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [orderId, setOrderId] = useState("");
  const [agentId, setAgentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  async function load() {
    try {
      const [agentsData, ordersData] = await Promise.all([
        getDeliveryAgents(),
        getAllDeliveries(),
      ]);
      setAgents(agentsData);
      setOrders(ordersData);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAssign() {
    if (!orderId || !agentId) {
      toast.error("Please select both an order and a delivery agent");
      return;
    }
    try {
      await assignDeliveryAgent(Number(orderId), Number(agentId));
      toast.success("Delivery agent assigned");
      load();
    } catch {
      toast.error("Failed to assign delivery agent");
    }
  }

  const filteredOrders = activeFilter === "All"
    ? orders
    : orders.filter((o: any) => o.status === activeFilter);

  const statusCounts = ALL_STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = s === "All" ? orders.length : orders.filter((o: any) => o.status === s).length;
    return acc;
  }, {});

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
            <span className="font-mono text-xs uppercase tracking-widest text-primary animate-pulse">Loading Deliveries...</span>
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
            Delivery Management
          </h1>
          <p className="text-foreground/50 font-mono mt-2 uppercase tracking-widest text-sm">
            Assign & track delivery agents
          </p>
        </div>

        {/* Assignment Panel */}
        <div className="rounded-2xl border border-border bg-surface p-6 premium-card shadow-sm mb-8">
          <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-foreground/70 mb-6 flex items-center gap-2">
            <BsTruck className="text-primary" /> Assign Delivery Agent
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-foreground/50 mb-2">Order</label>
              <select
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold outline-none cursor-pointer hover:border-primary transition-all"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              >
                <option value="">Select Order</option>
                {orders.map((o: any) => (
                  <option key={o.orderId} value={o.orderId}>
                    #{o.orderId} — {o.customerName} ({STATUS_CONFIG[o.status]?.label ?? o.status})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-foreground/50 mb-2">Delivery Agent</label>
              <select
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold outline-none cursor-pointer hover:border-primary transition-all"
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
              >
                <option value="">Select Agent</option>
                {agents.map((a: any) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAssign}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-bold text-white transition-all hover:opacity-90 shadow-lg shadow-primary/20"
              >
                <BsArrowRepeat size={14} /> Assign / Reassign
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", count: orders.length, icon: <BsBox size={18} />, color: "text-primary" },
            { label: "Assigned", count: statusCounts["Assigned"] ?? 0, icon: <BsPerson size={18} />, color: "text-blue-500" },
            { label: "Out for Delivery", count: statusCounts["OutForDelivery"] ?? 0, icon: <BsTruck size={18} />, color: "text-violet-500" },
            { label: "Delivered", count: statusCounts["Delivered"] ?? 0, icon: <BsCheck2Circle size={18} />, color: "text-emerald-500" },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl border border-border bg-surface p-5 premium-card shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className={card.color}>{card.icon}</span>
                <span className="text-3xl font-black text-foreground tracking-tighter">{card.count}</span>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/50">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {ALL_STATUSES.map((s) => {
            const count = statusCounts[s] ?? 0;
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
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Deliveries Table */}
        <div className="rounded-2xl border border-border bg-surface shadow-sm premium-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-background/50 font-mono text-xs uppercase text-foreground/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Order</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Customer</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Amount</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Agent</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-foreground/40">
                        <BsTruck size={32} />
                        <p className="font-mono text-xs uppercase tracking-widest">No deliveries found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o: any) => {
                    const config = STATUS_CONFIG[o.status];
                    return (
                      <tr key={o.orderId} className="hover:bg-background/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-foreground/50">#{o.orderId}</td>
                        <td className="px-6 py-4 font-medium text-foreground">{o.customerName}</td>
                        <td className="px-6 py-4 font-bold text-foreground">₹{o.totalAmount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          {o.deliveryAgentName === "Not Assigned" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-widest bg-amber-500/10 text-amber-600 border border-amber-500/20">
                              <BsHourglass size={10} /> Unassigned
                            </span>
                          ) : (
                            <span className="font-medium text-foreground">{o.deliveryAgentName}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-widest border ${
                            config?.classes || 'bg-surface border-border text-foreground/70'
                          }`}>
                            {config?.label ?? o.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
