import { useEffect, useState } from "react";
import {
  getAssignedOrders,
  sendDeliveryOtp,
  verifyDeliveryOtp,
  startDelivery,
} from "../../services/deliveryService";

import toast from "react-hot-toast";
import { BsTruck, BsCheck2Circle, BsPlay, BsShieldLock, BsBox, BsPerson, BsTelephone, BsGeoAlt } from "react-icons/bs";

const STATUS_CONFIG: Record<string, { label: string; classes: string; icon: React.ReactNode }> = {
  Assigned:       { label: "Assigned",         classes: "bg-blue-500/10 text-blue-600 border-blue-500/20",       icon: <BsPerson size={10} /> },
  OutForDelivery: { label: "Out for Delivery", classes: "bg-violet-500/10 text-violet-600 border-violet-500/20", icon: <BsTruck size={10} /> },
  Delivered:      { label: "Delivered",        classes: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: <BsCheck2Circle size={10} /> },
  Cancelled:      { label: "Cancelled",        classes: "bg-red-500/10 text-red-600 border-red-500/20", icon: <BsBox size={10} /> },
};

interface DeliveryOrder {
  orderId: number;
  customerName: string;
  phoneNumber: string;
  address: string;
  totalAmount: number;
  status: string;
}

export default function DeliveryPage() {
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [otp, setOtp] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [processingId, setProcessingId] = useState<number | null>(null);

  async function loadOrders() {
    try {
      const data = await getAssignedOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const filterTabs = ["All", "Assigned", "OutForDelivery", "Delivered", "Cancelled"] as const;

  const filteredOrders = activeFilter === "All"
    ? orders
    : orders.filter((o) => o.status === activeFilter);

  const statusCounts = filterTabs.reduce<Record<string, number>>((acc, s) => {
    acc[s] = s === "All" ? orders.length : orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
          <span className="font-mono text-xs uppercase tracking-widest text-primary animate-pulse">Loading Deliveries...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Delivery Dashboard
          </h1>
          <p className="text-foreground/50 font-mono mt-2 uppercase tracking-widest text-sm">
            Your assigned deliveries
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", count: orders.length, icon: <BsBox size={18} />, color: "text-primary" },
            { label: "To Start", count: statusCounts["Assigned"] ?? 0, icon: <BsPlay size={18} />, color: "text-blue-500" },
            { label: "In Transit", count: statusCounts["OutForDelivery"] ?? 0, icon: <BsTruck size={18} />, color: "text-violet-500" },
            { label: "Completed", count: statusCounts["Delivered"] ?? 0, icon: <BsCheck2Circle size={18} />, color: "text-emerald-500" },
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

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab;
            const label = tab === "All" ? "All" : (STATUS_CONFIG[tab]?.label ?? tab);
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
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
                  {statusCounts[tab] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border p-16 flex flex-col items-center gap-4 text-foreground/40">
            <BsTruck size={40} />
            <p className="font-mono text-xs uppercase tracking-widest">No deliveries found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredOrders.map((order) => {
              const config = STATUS_CONFIG[order.status];
              const isProcessing = processingId === order.orderId;
              return (
                <div
                  key={order.orderId}
                  className="rounded-2xl border border-border bg-surface premium-card shadow-sm overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-border/50 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-foreground">Order #{order.orderId}</h2>
                      <p className="text-xs font-mono text-foreground/50 mt-0.5">₹{order.totalAmount.toLocaleString()}</p>
                    </div>
                    {config && (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-widest border ${config.classes}`}>
                        {config.icon}
                        {config.label}
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background rounded-lg border border-border text-foreground/50">
                        <BsPerson size={14} />
                      </div>
                      <div>
                        <p className="text-xs text-foreground/40 font-mono uppercase tracking-widest">Customer</p>
                        <p className="font-bold text-foreground text-sm">{order.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background rounded-lg border border-border text-foreground/50">
                        <BsTelephone size={14} />
                      </div>
                      <div>
                        <p className="text-xs text-foreground/40 font-mono uppercase tracking-widest">Phone</p>
                        <p className="font-bold text-foreground text-sm">{order.phoneNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background rounded-lg border border-border text-foreground/50">
                        <BsGeoAlt size={14} />
                      </div>
                      <div>
                        <p className="text-xs text-foreground/40 font-mono uppercase tracking-widest">Address</p>
                        <p className="font-bold text-foreground text-sm">{order.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-5 border-t border-border/50 bg-background/30">
                    {order.status === "Assigned" ? (
                      <button
                        disabled={isProcessing}
                        onClick={async () => {
                          setProcessingId(order.orderId);
                          try {
                            await startDelivery(order.orderId);
                            toast.success("Delivery started");
                            await loadOrders();
                          } catch {
                            toast.error("Failed to start delivery");
                          } finally {
                            setProcessingId(null);
                          }
                        }}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 font-bold text-white transition-all hover:bg-violet-700 disabled:opacity-50 shadow-lg shadow-violet-600/20"
                      >
                        <BsPlay size={16} /> {isProcessing ? "Starting..." : "Start Delivery"}
                      </button>
                    ) : order.status === "OutForDelivery" ? (
                      <div className="space-y-3">
                        {selectedOrderId === order.orderId ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Enter OTP"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-mono tracking-widest text-center outline-none focus:border-primary transition-all"
                            />
                            <button
                              disabled={isProcessing}
                              onClick={async () => {
                                setProcessingId(order.orderId);
                                try {
                                  await verifyDeliveryOtp(order.orderId, otp);
                                  toast.success("Delivery confirmed!");
                                  setOtp("");
                                  setSelectedOrderId(null);
                                  await loadOrders();
                                } catch {
                                  toast.error("Invalid OTP");
                                } finally {
                                  setProcessingId(null);
                                }
                              }}
                              className="rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition-all hover:bg-emerald-700 disabled:opacity-50"
                            >
                              {isProcessing ? "..." : "Verify"}
                            </button>
                          </div>
                        ) : (
                          <button
                            disabled={isProcessing}
                            onClick={async () => {
                              setProcessingId(order.orderId);
                              try {
                                await sendDeliveryOtp(order.orderId);
                                setSelectedOrderId(order.orderId);
                                toast.success("OTP sent to customer");
                              } catch {
                                toast.error("Failed to send OTP");
                              } finally {
                                setProcessingId(null);
                              }
                            }}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 shadow-lg shadow-primary/20"
                          >
                            <BsShieldLock size={14} /> {isProcessing ? "Sending..." : "Request OTP & Confirm Delivery"}
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 py-2 text-emerald-600 font-bold">
                        <BsCheck2Circle size={18} />
                        <span>Delivery Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
