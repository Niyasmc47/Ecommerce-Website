import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AdminLayout from "../../components/layouts/AdminLayout";

import {
  getReturnRequests,
  approveReturn,
  rejectReturn,
} from "../../services/returnService";

import { BsArrowRepeat, BsCheck2Circle, BsXCircle, BsHourglass, BsBox, BsExclamationTriangle } from "react-icons/bs";

interface ReturnRequest {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  reason: string;
  status: string;
  requestedAt: string;
  processedAt: string | null;
  customerName: string;
}

const STATUS_TABS = ["All", "Pending", "Approved", "Rejected"] as const;

const STATUS_BADGE: Record<string, { label: string; classes: string; icon: React.ReactNode }> = {
  Pending:  { label: "Pending",  classes: "bg-amber-500/10 text-amber-600 border-amber-500/20",     icon: <BsHourglass size={10} /> },
  Approved: { label: "Approved", classes: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: <BsCheck2Circle size={10} /> },
  Rejected: { label: "Rejected", classes: "bg-rose-500/10 text-rose-600 border-rose-500/20",         icon: <BsXCircle size={10} /> },
};

export default function AdminReturnsPage() {
  const [requests, setRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [processingId, setProcessingId] = useState<number | null>(null);

  async function load() {
    try {
      const data = await getReturnRequests();
      setRequests(data);
    } catch {
      toast.error("Failed to load return requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredRequests = activeTab === "All"
    ? requests
    : requests.filter((r) => r.status === activeTab);

  const counts = {
    All: requests.length,
    Pending: requests.filter((r) => r.status === "Pending").length,
    Approved: requests.filter((r) => r.status === "Approved").length,
    Rejected: requests.filter((r) => r.status === "Rejected").length,
  };

  async function handleApprove(id: number) {
    if (!window.confirm("Are you sure you want to approve this return? Stock will be restored.")) return;
    setProcessingId(id);
    try {
      await approveReturn(id);
      toast.success("Return approved");
      load();
    } catch {
      toast.error("Failed to approve return");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(id: number) {
    if (!window.confirm("Are you sure you want to reject this return request?")) return;
    setProcessingId(id);
    try {
      await rejectReturn(id);
      toast.success("Return rejected");
      load();
    } catch {
      toast.error("Failed to reject return");
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
            <span className="font-mono text-xs uppercase tracking-widest text-primary animate-pulse">Loading Returns...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Return Requests
          </h1>
          <p className="text-foreground/50 font-mono mt-2 uppercase tracking-widest text-sm">
            Review & manage product returns
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", count: counts.All, icon: <BsArrowRepeat size={18} />, color: "text-primary" },
            { label: "Pending", count: counts.Pending, icon: <BsHourglass size={18} />, color: "text-amber-500" },
            { label: "Approved", count: counts.Approved, icon: <BsCheck2Circle size={18} />, color: "text-emerald-500" },
            { label: "Rejected", count: counts.Rejected, icon: <BsXCircle size={18} />, color: "text-rose-500" },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl border border-border bg-surface p-5 premium-card shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className={`${card.color}`}>{card.icon}</span>
                <span className="text-3xl font-black text-foreground tracking-tighter">{card.count}</span>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/50">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {STATUS_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-surface border border-border text-foreground/60 hover:border-primary/40 hover:text-primary"
                }`}
              >
                {tab}
                <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-background text-foreground/50"
                }`}>
                  {counts[tab as keyof typeof counts]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-border bg-surface shadow-sm premium-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-background/50 font-mono text-xs uppercase text-foreground/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">ID</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Customer</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Order</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Product</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Reason</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Date</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-foreground/40">
                        <BsBox size={32} />
                        <p className="font-mono text-xs uppercase tracking-widest">No return requests found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => {
                    const badge = STATUS_BADGE[request.status];
                    const isProcessing = processingId === request.id;
                    return (
                      <tr key={request.id} className="hover:bg-background/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-foreground/50">#{request.id}</td>
                        <td className="px-6 py-4 font-medium text-foreground">{request.customerName}</td>
                        <td className="px-6 py-4 font-mono text-xs text-foreground/70">#{request.orderId}</td>
                        <td className="px-6 py-4 text-foreground">
                          <div className="max-w-[180px] truncate" title={request.productName}>{request.productName}</div>
                        </td>
                        <td className="px-6 py-4 text-foreground/70">
                          <div className="max-w-[200px] truncate" title={request.reason}>{request.reason}</div>
                        </td>
                        <td className="px-6 py-4">
                          {badge ? (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-widest border ${badge.classes}`}>
                              {badge.icon}
                              {badge.label}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-widest bg-surface border border-border text-foreground/70">
                              {request.status}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-foreground/70 text-xs">
                          <div>{new Date(request.requestedAt).toLocaleDateString()}</div>
                          {request.processedAt && (
                            <div className="text-foreground/40 mt-0.5">
                              Processed: {new Date(request.processedAt).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {request.status === "Pending" ? (
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => handleApprove(request.id)}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-600 transition hover:bg-emerald-500 hover:text-white disabled:opacity-50"
                              >
                                <BsCheck2Circle size={12} />
                                {isProcessing ? "..." : "Approve"}
                              </button>
                              <button
                                onClick={() => handleReject(request.id)}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-500 hover:text-white disabled:opacity-50"
                              >
                                <BsXCircle size={12} />
                                {isProcessing ? "..." : "Reject"}
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-foreground/30 font-mono uppercase tracking-widest">
                              {request.status === "Approved" ? "Completed" : "Closed"}
                            </span>
                          )}
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