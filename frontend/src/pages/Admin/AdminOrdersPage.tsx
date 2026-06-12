import { useEffect, useState } from "react";

import AdminLayout from "../../components/layouts/AdminLayout";

import { getOrders } from "../../services/adminService";

import type { AdminOrder } from "../../types/admin";

import { Link } from "react-router-dom";

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
    return <AdminLayout>Loading orders...</AdminLayout>;
  }

  return (
    <AdminLayout>
      <h1
        className="
      mb-8
      text-4xl
      font-bold
    "
      >
        Orders
      </h1>

      <div
        className="overflow-x-auto rounded-2xl border"
      >
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left">ID</th>

              <th className="p-4 text-left">Amount</th>

              <th className="p-4 text-left">Status</th>

              <th className="p-4 text-left">Date</th>

              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="p-4">{order.id}</td>

                <td className="p-4">₹{order.totalAmount}</td>

                <td className="p-4">{order.status}</td>

                <td className="p-4">
                  {new Date(order.createdDate).toLocaleDateString()}
                </td>

                <td className="p-4">
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="
                  rounded-lg
                  bg-blue-600
                  px-3
                  py-2
                  text-white
                "
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
