import { useEffect, useState } from "react";
import SellerLayout from "../../components/layouts/SellerLayout";
import { getSellerDashboard } from "../../services/sellerService";
import { FaBox, FaShoppingCart } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import type { SellerDashboard } from "../../types/seller";

export default function SellerDashboardPage() {
  const [dashboard, setDashboard] = useState<SellerDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSellerDashboard();
        setDashboard(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <SellerLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
            <span className="font-mono text-xs uppercase tracking-widest text-primary animate-pulse">
              Loading Dashboard...
            </span>
          </div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Seller Dashboard
          </h1>
          <p className="text-foreground/50 font-mono mt-2 uppercase tracking-widest text-sm">
            Your store overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <div className="rounded-2xl border border-border bg-surface p-6 premium-card shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-[30px] group-hover:bg-primary/10 transition-colors"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <FaBox className="text-2xl text-primary" />
              <span className="text-xs font-mono uppercase tracking-wider text-foreground/40">
                Total Products
              </span>
            </div>
            <h2 className="text-4xl font-black text-foreground relative z-10">
              {dashboard?.totalProducts.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 premium-card shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-[30px] group-hover:bg-primary/10 transition-colors"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <FaShoppingCart className="text-2xl text-primary" />
              <span className="text-xs font-mono uppercase tracking-wider text-foreground/40">
                Total Orders
              </span>
            </div>
            <h2 className="text-4xl font-black text-foreground relative z-10">
              {dashboard?.totalOrders.toLocaleString()}
            </h2>
          </div>

          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 premium-card shadow-lg shadow-primary/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <FaIndianRupeeSign className="text-2xl text-primary" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                Total Revenue
              </span>
            </div>
            <h2 className="text-3xl font-black text-foreground relative z-10 tracking-tighter">
              ₹{dashboard?.totalRevenue.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-2xl border border-border bg-surface shadow-sm premium-card">
          <div className="p-6 border-b border-border/50">
            <h2 className="text-xl font-bold">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-background/50 font-mono text-xs uppercase text-foreground/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 font-bold tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 font-bold tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-4 font-bold tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 font-bold tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {dashboard?.recentOrders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="hover:bg-background/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-foreground/50">
                      #{order.orderId}
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">
                      ₹{order.sellerTotal.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-widest ${
                          order.status === "Delivered"
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : order.status === "OutForDelivery"
                              ? "bg-secondary/10 text-secondary border border-secondary/20"
                              : "bg-surface border border-border text-foreground/70"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground/50 font-mono text-xs">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {(!dashboard?.recentOrders ||
                  dashboard.recentOrders.length === 0) && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-foreground/40"
                    >
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
