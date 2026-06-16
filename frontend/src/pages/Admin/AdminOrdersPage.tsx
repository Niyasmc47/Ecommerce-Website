import { useEffect, useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import { getOrders } from "../../services/adminService";
import type { AdminOrder } from "../../types/admin";
import { Link } from "react-router-dom";
import { BsEye } from "react-icons/bs";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

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

        <div className="rounded-2xl border border-border bg-surface shadow-sm premium-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-background/50 font-mono text-xs uppercase text-foreground/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Req ID</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Value</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-foreground/50">#{order.id}</td>
                    <td className="px-6 py-4 font-bold text-foreground">₹{order.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-widest ${
                         order.status === 'Completed' ? 'bg-primary/10 text-primary border border-primary/20' : 
                         order.status === 'Processing' ? 'bg-secondary/10 text-secondary border border-secondary/20' : 
                         'bg-surface border border-border text-foreground/70'
                       }`}>
                         {order.status === 'Processing' && <span className="w-1 h-1 rounded-full bg-secondary animate-pulse"></span>}
                         {order.status}
                       </span>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
