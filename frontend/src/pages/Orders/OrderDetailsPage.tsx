import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { deleteOrder } from "../../services/orderService";
import MainLayout from "../../components/layouts/MainLayout";
import Container from "../../components/common/Container";

import { getOrderById } from "../../services/orderService";

import type { OrderDetails, OrderItem } from "../../types/orderDetails";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!id) {
        setLoading(false);

        return;
      }

      const orderId = Number(id);

      if (Number.isNaN(orderId)) {
        setLoading(false);

        return;
      }

      try {
        const data = await getOrderById(orderId);

        setOrder(data);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [id]);

  async function handleDelete() {
    if (!order) return;

    if (!window.confirm("Delete this delivered order?")) {
      return;
    }

    try {
      await deleteOrder(order.id);

      toast.success("Order deleted");

      navigate("/orders");
    } catch {
      toast.error("Failed to delete order");
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <Container>
          <div className="py-20">Loading...</div>
        </Container>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <Container>
          <div className="py-20">Order not found.</div>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container>
        <div
          className="
            py-20
            max-w-5xl
            mx-auto
          "
        >
          <Link
            to="/orders"
            className="
              text-emerald-600
              hover:underline
            "
          >
            ← Back to Orders
          </Link>

          <h1
            className="
              text-4xl
              font-bold
              mt-6
              mb-8
            "
          >
            Order #{order.id}
          </h1>

          <div
            className="
              rounded-3xl
              border
              p-6
              mb-6
            "
          >
            <h2
              className="
                text-2xl
                font-semibold
                mb-4
              "
            >
              Order Information
            </h2>

            <p>
              <strong>Status:</strong> {order.status}
            </p>

            <p>
              <strong>Payment Status:</strong> {order.paymentStatus}
            </p>

            <p>
              <strong>Payment Method:</strong> {order.paymentMethod}
            </p>

            <p>
              <strong>Total:</strong> ₹{order.totalAmount}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.createdDate).toLocaleString()}
            </p>
          </div>

          <div
            className="
              rounded-3xl
              border
              p-6
              mb-6
            "
          >
            <h2
              className="
                text-2xl
                font-semibold
                mb-4
              "
            >
              Shipping Address
            </h2>

            <p>{order.fullName}</p>

            <p>{order.phoneNumber}</p>

            <p>{order.addressLine1}</p>

            {order.addressLine2 && <p>{order.addressLine2}</p>}

            <p>
              {order.city}, {order.state}
            </p>

            <p>{order.country}</p>

            <p>{order.postalCode}</p>
          </div>

          <div
            className="
              rounded-3xl
              border
              p-6
            "
          >
            <h2
              className="
                text-2xl
                font-semibold
                mb-4
              "
            >
              Products
            </h2>

            {order.items.map((item: OrderItem) => (
              <div
                key={`${item.productId}-${item.quantity}`}
                className="
                    flex
                    justify-between
                    items-center
                    border-b
                    py-4
                  "
              >
                <div>
                  <div
                    className="
                        font-medium
                      "
                  >
                    {item.productName}
                  </div>

                  <div
                    className="
                        text-sm
                        text-slate-500
                      "
                  >
                    Quantity: {item.quantity}
                  </div>
                </div>

                <div
                  className="
                      font-semibold
                    "
                >
                  ₹{item.price}
                </div>
              </div>
            ))}
          </div>

          {order.status === "Delivered" && (
            <div className="mt-6">
              <button
                onClick={handleDelete}
                className="
        rounded-xl
        bg-red-600
        px-5
        py-3
        font-medium
        text-white
        hover:bg-red-700
      "
              >
                Delete Order
              </button>
            </div>
          )}
        </div>
      </Container>
    </MainLayout>
  );
}
