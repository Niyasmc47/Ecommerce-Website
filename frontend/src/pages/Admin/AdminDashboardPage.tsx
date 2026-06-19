import { useEffect, useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import { getDashboardStats, getUsers, getOrders } from "../../services/adminService";
import { FaUsers, FaBox, FaShoppingCart } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import type { DashboardStats, AdminUser, AdminOrder } from "../../types/admin";

const STATUS_COLORS: Record<string, string> = {
  Delivered: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  OutForDelivery: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  Assigned: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  ReturnRequested: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  Returned: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  Cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
};

const STATUS_LABELS: Record<string, string> = {
  OutForDelivery: "Out for Delivery",
  ReturnRequested: "Return Requested",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, usersData, ordersData] = await Promise.all([
          getDashboardStats(),
          getUsers(),
          getOrders(),
        ]);
        setStats(statsData);
        setUsers(usersData);
        setOrders(ordersData);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] items-center justify-center">
           <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
              <span className="font-mono text-xs uppercase tracking-widest text-primary animate-pulse">Loading Dashboard...</span>
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
             Dashboard
           </h1>
           <p className="text-foreground/50 font-mono mt-2 uppercase tracking-widest text-sm">Overview & Analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <div className="rounded-2xl border border-border bg-surface p-6 premium-card shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-[30px] group-hover:bg-primary/10 transition-colors"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
               <FaUsers className="text-2xl text-primary" />
               <span className="text-xs font-mono uppercase tracking-wider text-foreground/40">Total Users</span>
            </div>
            <h2 className="text-4xl font-black text-foreground relative z-10">{stats?.totalUsers.toLocaleString()}</h2>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 premium-card shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-[30px] group-hover:bg-primary/10 transition-colors"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
               <FaBox className="text-2xl text-primary" />
               <span className="text-xs font-mono uppercase tracking-wider text-foreground/40">Total Products</span>
            </div>
            <h2 className="text-4xl font-black text-foreground relative z-10">{stats?.totalProducts.toLocaleString()}</h2>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 premium-card shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-[30px] group-hover:bg-primary/10 transition-colors"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
               <FaShoppingCart className="text-2xl text-primary" />
               <span className="text-xs font-mono uppercase tracking-wider text-foreground/40">Total Orders</span>
            </div>
            <h2 className="text-4xl font-black text-foreground relative z-10">{stats?.totalOrders.toLocaleString()}</h2>
          </div>

          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 premium-card shadow-lg shadow-primary/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
               <FaIndianRupeeSign className="text-2xl text-primary" />
               <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">Total Revenue</span>
            </div>
            <h2 className="text-3xl font-black text-foreground relative z-10 tracking-tighter">₹{stats?.totalRevenue.toLocaleString()}</h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
           {/* Recent Users Table */}
           <div className="rounded-2xl border border-border bg-surface shadow-sm premium-card flex flex-col">
             <div className="p-6 border-b border-border/50">
               <h2 className="text-xl font-bold">Recent Users</h2>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                 <thead className="bg-background/50 font-mono text-xs uppercase text-foreground/50 border-b border-border">
                   <tr>
                     <th className="px-6 py-4 font-bold tracking-wider">ID</th>
                     <th className="px-6 py-4 font-bold tracking-wider">User</th>
                     <th className="px-6 py-4 font-bold tracking-wider">Role</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-border/50">
                   {users.slice(0, 5).map((user) => (
                     <tr key={user.id} className="hover:bg-background/50 transition-colors">
                       <td className="px-6 py-4 font-mono text-xs text-foreground/50">#{user.id}</td>
                       <td className="px-6 py-4">
                          <div className="font-bold text-foreground">{user.name}</div>
                          <div className="text-xs text-foreground/50">{user.email}</div>
                       </td>
                       <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold font-mono uppercase tracking-widest ${user.role === 'Admin' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-surface border border-border text-foreground/70'}`}>
                            {user.role}
                          </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>

           {/* Recent Orders Table */}
           <div className="rounded-2xl border border-border bg-surface shadow-sm premium-card flex flex-col">
             <div className="p-6 border-b border-border/50">
               <h2 className="text-xl font-bold">Recent Orders</h2>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                 <thead className="bg-background/50 font-mono text-xs uppercase text-foreground/50 border-b border-border">
                   <tr>
                     <th className="px-6 py-4 font-bold tracking-wider">ID</th>
                     <th className="px-6 py-4 font-bold tracking-wider">Value</th>
                     <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-border/50">
                   {orders.slice(0, 5).map((order) => (
                     <tr key={order.id} className="hover:bg-background/50 transition-colors">
                       <td className="px-6 py-4 font-mono text-xs text-foreground/50">#{order.id}</td>
                       <td className="px-6 py-4 font-bold text-foreground">₹{order.totalAmount.toLocaleString()}</td>
                       <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-widest border ${
                            STATUS_COLORS[order.status] || 'bg-surface border-border text-foreground/70'
                          }`}>
                            {(order.status === 'Assigned' || order.status === 'OutForDelivery') && <span className="w-1 h-1 rounded-full bg-current animate-pulse"></span>}
                            {STATUS_LABELS[order.status] || order.status}
                          </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}
