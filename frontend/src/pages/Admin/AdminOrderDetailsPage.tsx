import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import AdminLayout from "../../components/layouts/AdminLayout";

import { getOrderById } from "../../services/adminService";

import type { AdminOrderDetails } from "../../types/admin";

import { updateOrderStatus } from "../../services/adminService";

import toast from "react-hot-toast";
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

      setOrder({
        ...order,
        status,
      });

      toast.success("Status updated");
    } catch {
      toast.error("Update failed");
    }
  }

  if (loading) {
    return <AdminLayout>Loading...</AdminLayout>;
  }

  if (!order) {
    return <AdminLayout>Order not found</AdminLayout>;
  }

  return (
    <AdminLayout>
      <h1
        className="
          mb-8
          text-4xl
          font-bold
          dark:text-white
        "
      >
        Order #{order.id}
      </h1>

      <div
        className="
          mb-8
          rounded-2xl
          border
          border-slate-200
          p-6
          dark:border-slate-700
          dark:bg-slate-900
        "
      >
        <p className="dark:text-slate-300">
          <strong>Customer:</strong> {order.customerName}
        </p>

        <p className="dark:text-slate-300">
          <strong>Email:</strong> {order.customerEmail}
        </p>

        <div className="mt-4">
          <strong>Status:</strong>

          <div className="mt-2 flex gap-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="
        rounded-lg
        border
        border-slate-200
        px-3
        py-2
        dark:border-slate-700
        dark:bg-slate-950
        dark:text-white
      "
            >
              <option>Pending</option>

              <option>Processing</option>

              <option>Shipped</option>

              <option>Delivered</option>

              <option>Cancelled</option>
            </select>

            <button
              onClick={handleStatusUpdate}
              className="
        rounded-lg
        bg-blue-600
        px-4
        py-2
        text-white
      "
            >
              Save
            </button>
          </div>
        </div>

        <p className="dark:text-slate-300">
          <strong>Total:</strong> ₹{order.totalAmount}
        </p>
      </div>

      <div
        className="
          rounded-2xl
          border
          border-slate-200
          p-6
          dark:border-slate-700
          dark:bg-slate-900
        "
      >
        <h2
          className="
            mb-4
            text-2xl
            font-bold
            dark:text-white
          "
        >
          Order Items
        </h2>

        <table
          className="
            w-full
          "
        >
          <thead>
            <tr>
              <th className="text-left dark:text-slate-300">Product</th>

              <th className="text-left dark:text-slate-300">Quantity</th>

              <th className="text-left dark:text-slate-300">Price</th>
            </tr>
          </thead>

          <tbody>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td className="dark:text-slate-300">{item.productName}</td>

                <td className="dark:text-slate-300">{item.quantity}</td>

                <td className="dark:text-slate-300">₹{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
