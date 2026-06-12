import { useEffect, useState } from "react";

import MainLayout from "../../components/layouts/MainLayout";
import Container from "../../components/common/Container";

import { getOrders } from "../../services/orderService";

import type { Order } from "../../types/order";

export default function OrdersPage() {
  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data =
          await getOrders();

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
                dark:text-white
              "
            >
              My Orders
            </h1>

            <p
              className="
                mt-3
                text-slate-500
                dark:text-slate-400
              "
            >
              Track and manage your orders.
            </p>

          </div>

          {loading ? (

            <div>
              Loading...
            </div>

          ) : orders.length === 0 ? (

            <div
              className="
                rounded-3xl
                bg-white
                dark:bg-slate-900
                p-10
                shadow-sm
                ring-1
                ring-slate-200
                dark:ring-slate-700
              "
            >
              No orders found.
            </div>

          ) : (

            <div className="space-y-4">

              {orders.map(
                (order) => (
                  <div
                    key={order.id}
                    className="
                      rounded-3xl
                      bg-white
                      dark:bg-slate-900
                      p-6
                      shadow-sm
                      ring-1
                      ring-slate-200
                      dark:ring-slate-700
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <div>

                        <h3
                          className="
                            text-xl
                            font-semibold
                            dark:text-white
                          "
                        >
                          Order #{order.id}
                        </h3>

                        <p
                          className="
                            mt-2
                            text-slate-500
                            dark:text-slate-400
                          "
                        >
                          {new Date(
                            order.createdDate
                          ).toLocaleDateString()}
                        </p>

                      </div>

                      <div
                        className="
                          text-right
                        "
                      >

                        <div
                          className="
                            text-2xl
                            font-bold
                            dark:text-white
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

                    </div>

                  </div>
                )
              )}

            </div>

          )}

        </div>

      </Container>
    </MainLayout>
  );
}