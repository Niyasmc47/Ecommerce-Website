import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AdminLayout from "../../components/layouts/AdminLayout";
import { getOrderById, updateOrderStatus } from "../../services/adminService";
import type { AdminOrderDetails } from "../../types/admin";
import toast from "react-hot-toast";
import { BsArrowLeft, BsPerson, BsEnvelope, BsBox, BsReceipt } from "react-icons/bs";

export default function AdminOrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<AdminOrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const data = await getOrderById(Number(id));
        setOrder(data);
        setStatus(data.status);
      } catch {
        toast.error("Failed to load order data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleStatusUpdate() {
    if (!order) return;
    try {
      await updateOrderStatus(order.id, status);
      setOrder({ ...order, status });
      toast.success("Order status updated");
    } catch {
      toast.error("Status modification failed");
    }
  }

  if (loading) {
    return (
       <AdminLayout>
         <div className="flex h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
               <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
               <span className="font-mono text-xs uppercase tracking-widest text-primary animate-pulse">Loading Order Data...</span>
            </div>
         </div>
       </AdminLayout>
    );
  }

  if (!order) {
    return (
       <AdminLayout>
         <div className="flex flex-col items-center justify-center h-[60vh] text-foreground/40 border-2 border-dashed border-border rounded-3xl bg-surface/50">
            <span className="text-4xl mb-4">⚠️</span>
            <p className="font-mono text-sm uppercase tracking-widest">Order not found</p>
         </div>
       </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-10">
        <Link to="/admin/orders" className="inline-flex items-center gap-2 text-foreground/50 hover:text-primary transition-colors font-mono text-xs uppercase tracking-widest mb-8">
           <BsArrowLeft size={16} /> Return to Orders
        </Link>
        
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                Order <span className="text-primary font-mono">#{order.id}</span>
              </h1>
              <p className="text-foreground/50 font-mono mt-2 uppercase tracking-widest text-sm">Order Details</p>
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           {/* Shipping Status Panel */}
           <div className="lg:col-span-1 space-y-8">
              <div className="rounded-3xl border border-border bg-surface p-6 premium-card shadow-sm">
                 <h2 className="text-sm font-mono font-bold uppercase tracking-widest border-b border-border/50 pb-4 mb-6 flex items-center gap-2 text-foreground/70">
                   <BsReceipt className="text-primary" /> Current Status
                 </h2>
                 <div className="space-y-4">
                    <div>
                       <select
                         value={status}
                         onChange={(e) => setStatus(e.target.value)}
                         className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold tracking-wider outline-none transition-all cursor-pointer hover:border-primary"
                       >
                         <option value="Pending">Pending Validation</option>
                         <option value="Processing">Processing</option>
                         <option value="Shipped">In Transit</option>
                         <option value="Delivered">Delivered</option>
                         <option value="Cancelled">Mission Aborted</option>
                       </select>
                    </div>
                    <button
                      onClick={handleStatusUpdate}
                      disabled={status === order.status}
                      className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold transition-all ${
                         status !== order.status ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 cyber-glow-hover' : 'bg-surface border border-border text-foreground/40 cursor-not-allowed'
                      }`}
                    >
                      Commit Status
                    </button>
                 </div>
              </div>

              <div className="rounded-3xl border border-border bg-surface p-6 premium-card shadow-sm">
                 <h2 className="text-sm font-mono font-bold uppercase tracking-widest border-b border-border/50 pb-4 mb-6 flex items-center gap-2 text-foreground/70">
                   <BsPerson className="text-primary" /> Customer Info
                 </h2>
                 <div className="space-y-4 font-mono text-sm">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-background rounded-lg border border-border text-foreground/50"><BsPerson size={14} /></div>
                       <div>
                          <p className="text-xs text-foreground/40 uppercase tracking-widest">Name</p>
                          <p className="font-bold text-foreground">{order.customerName}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-background rounded-lg border border-border text-foreground/50"><BsEnvelope size={14} /></div>
                       <div>
                          <p className="text-xs text-foreground/40 uppercase tracking-widest">Comm Link</p>
                          <p className="font-bold text-foreground">{order.customerEmail}</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Hardware Payload */}
           <div className="lg:col-span-2">
              <div className="rounded-3xl border border-border bg-surface premium-card shadow-sm overflow-hidden h-full flex flex-col">
                 <div className="p-6 border-b border-border/50 flex items-center justify-between">
                    <h2 className="text-sm font-mono font-bold uppercase tracking-widest flex items-center gap-2 text-foreground/70">
                      <BsBox className="text-primary" /> Order Items
                    </h2>
                    <div className="text-right">
                       <p className="text-xs font-mono uppercase tracking-widest text-foreground/50">Total Value</p>
                       <p className="text-2xl font-black text-foreground tracking-tighter">₹{order.totalAmount.toLocaleString()}</p>
                    </div>
                 </div>
                 
                 <div className="flex-1 overflow-x-auto p-6">
                    <table className="w-full text-sm text-left">
                      <thead className="font-mono text-xs uppercase text-foreground/50 border-b border-border">
                        <tr>
                          <th className="pb-4 font-bold tracking-wider">Product</th>
                          <th className="pb-4 font-bold tracking-wider text-center">Units</th>
                          <th className="pb-4 font-bold tracking-wider text-right">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {order.items.map((item, index) => (
                          <tr key={index} className="group">
                            <td className="py-4">
                               <div className="font-bold text-foreground group-hover:text-primary transition-colors">{item.productName}</div>
                            </td>
                            <td className="py-4 text-center">
                               <span className="inline-block px-2 py-1 rounded bg-background border border-border font-mono text-xs">
                                 x{item.quantity}
                               </span>
                            </td>
                            <td className="py-4 text-right font-mono font-bold">
                               ₹{item.price.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}
