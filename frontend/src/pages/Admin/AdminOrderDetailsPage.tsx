import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import AdminLayout
from "../../components/layouts/AdminLayout";

import {
  getOrderById,
} from "../../services/adminService";

import type {
  AdminOrderDetails,
} from "../../types/admin";

export default function AdminOrderDetailsPage() {

  const { id } =
    useParams();

  const [order, setOrder] =
    useState<
      AdminOrderDetails | null
    >(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function load() {

      if (!id)
        return;

      try {

        const data =
          await getOrderById(
            Number(id)
          );

        setOrder(data);

      } finally {

        setLoading(false);

      }
    }

    load();

  }, [id]);

  if (loading) {

    return (
      <AdminLayout>
        Loading...
      </AdminLayout>
    );
  }

  if (!order) {

    return (
      <AdminLayout>
        Order not found
      </AdminLayout>
    );
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
        Order #{order.id}
      </h1>

      <div
        className="
          mb-8
          rounded-2xl
          border
          p-6
        "
      >

        <p>
          <strong>
            Customer:
          </strong>
          {" "}
          {order.customerName}
        </p>

        <p>
          <strong>
            Email:
          </strong>
          {" "}
          {order.customerEmail}
        </p>

        <p>
          <strong>
            Status:
          </strong>
          {" "}
          {order.status}
        </p>

        <p>
          <strong>
            Total:
          </strong>
          {" "}
          ₹{order.totalAmount}
        </p>

      </div>

      <div
        className="
          rounded-2xl
          border
          p-6
        "
      >

        <h2
          className="
            mb-4
            text-2xl
            font-bold
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

              <th className="text-left">
                Product
              </th>

              <th className="text-left">
                Quantity
              </th>

              <th className="text-left">
                Price
              </th>

            </tr>

          </thead>

          <tbody>

            {order.items.map(
              (
                item,
                index
              ) => (

                <tr key={index}>

                  <td>
                    {
                      item.productName
                    }
                  </td>

                  <td>
                    {
                      item.quantity
                    }
                  </td>

                  <td>
                    ₹{item.price}
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </AdminLayout>

  );
}