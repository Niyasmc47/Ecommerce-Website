import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import MainLayout from "../../components/layouts/MainLayout";
import Container from "../../components/common/Container";
import type { Order } from "../../types/order";
import { getOrders } from "../../services/orderService";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getOrders();

        setOrders(data);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <Container>
          <div className="py-20">Loading orders...</div>
        </Container>
      </MainLayout>
    );
  }

  if (!orders.length) {
    return (
      <MainLayout>
        <Container>
          <div className="py-20">No orders found.</div>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container>
        <div className="py-20">
          <h1
            className="
              text-4xl
              font-bold
              mb-8
            "
          >
            My Orders
          </h1>

          <div
            className="
              rounded-3xl
              border
              p-6
            "
          >
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    rounded-2xl
                    border
                    border-slate-200
                    px-5
                    py-4
                  "
                >
                  <div>
                    <div className="text-lg font-semibold">
                      Order #{order.id}
                    </div>

                    <div className="text-sm text-slate-500">
                      {new Date(order.createdDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold">₹{order.totalAmount}</div>

                    <div className="text-sm text-slate-500">
                      {order.status}
                    </div>
                  </div>

                  <Link
                    to={`/orders/${order.id}`}
                    className="
                      rounded-xl
                      bg-emerald-600
                      px-4
                      py-2
                      font-medium
                      text-white
                      transition
                      hover:bg-emerald-700
                    "
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </MainLayout>
  );
}
