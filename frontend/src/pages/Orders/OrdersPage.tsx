import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import MainLayout from "../../components/layouts/MainLayout";
import Container from "../../components/common/Container";

import { getOrders } from "../../services/orderService";

import type { Order } from "../../types/order";

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

  return (
    <MainLayout>
      <Container>
        <div className="py-20">
          <div className="mb-12">
            <h1
              className="
                text-5xl
                font-bold
              "
            >
              My Orders
            </h1>

            <p
              className="
                mt-3
                text-slate-500
              "
            >
              Track and manage your orders.
            </p>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : orders.length === 0 ? (
            <div
              className="
                rounded-3xl
                border
                p-10
              "
            >
              No orders found.
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="
                      flex
                      items-center
                      justify-between
                      gap-6
                      rounded-3xl
                      border
                      p-5
                    "
                >
                  <div
                    className="
                        flex
                        items-center
                        gap-5
                      "
                  >
                    <img
                      src={order.productImage}
                      alt={order.productName}
                      className="
                          h-24
                          w-24
                          rounded-2xl
                          object-cover
                          border
                        "
                    />

                    <div>
                      <h3
                        className="
                            text-xl
                            font-semibold
                          "
                      >
                        {order.productName}
                      </h3>

                      {order.itemCount > 1 && (
                        <p
                          className="
                              text-slate-500
                            "
                        >
                          +{order.itemCount - 1} more item(s)
                        </p>
                      )}

                      <p
                        className="
                            mt-2
                            text-sm
                            text-slate-500
                          "
                      >
                        {new Date(order.createdDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div
                    className="
                        flex
                        items-center
                        gap-8
                      "
                  >
                    <div
                      className="
                          text-right
                        "
                    >
                      <div
                        className="
                            text-2xl
                            font-bold
                          "
                      >
                        ₹{order.totalAmount}
                      </div>

                      <div
                        className="
                            mt-2
                            inline-flex
                            rounded-full
                            bg-emerald-100
                            px-3
                            py-1
                            text-sm
                            font-medium
                            text-emerald-700
                          "
                      >
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
                          hover:bg-emerald-700
                        "
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </MainLayout>
  );
}
