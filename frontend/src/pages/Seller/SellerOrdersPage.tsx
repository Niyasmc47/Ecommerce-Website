import { useEffect, useState } from "react";
import SellerLayout from "../../components/layouts/SellerLayout";
import { getSellerOrders } from "../../services/sellerService";
import type { SellerOrder } from "../../types/seller";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSellerOrders();
        setOrders(data);
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
              Loading Orders...
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
            Orders
          </h1>
          <p className="text-foreground/50 font-mono mt-2 uppercase tracking-widest text-sm">
            Orders containing your products
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface shadow-sm premium-card overflow-hidden">
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
                    Your Revenue
                  </th>
                  <th className="px-6 py-4 font-bold tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 font-bold tracking-wider">Date</th>
                  <th className="px-6 py-4 font-bold tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {orders.map((order) => (
                  <>
                    <tr
                      key={order.orderId}
                      className="hover:bg-background/50 transition-colors cursor-pointer"
                      onClick={() =>
                        setExpandedOrder(
                          expandedOrder === order.orderId
                            ? null
                            : order.orderId,
                        )
                      }
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
                      <td className="px-6 py-4">
                        <button className="text-primary text-xs font-bold">
                          {expandedOrder === order.orderId
                            ? "Hide"
                            : "View Items"}
                        </button>
                      </td>
                    </tr>
                    {expandedOrder === order.orderId && (
                      <tr key={`${order.orderId}-details`}>
                        <td colSpan={6} className="px-6 py-4 bg-background/30">
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-4 py-2"
                              >
                                <div className="h-8 w-8 rounded bg-surface border border-border overflow-hidden shrink-0">
                                  <img
                                    src={item.productImage}
                                    alt={item.productName}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                </div>
                                <span className="font-bold text-sm flex-1">
                                  {item.productName}
                                </span>
                                <span className="text-foreground/50 text-sm">
                                  ×{item.quantity}
                                </span>
                                <span className="font-mono text-sm">
                                  ₹{item.total.toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
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
