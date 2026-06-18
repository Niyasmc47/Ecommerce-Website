import { useEffect, useState } from "react";
import {
  getAssignedOrders,
  sendDeliveryOtp,
  verifyDeliveryOtp,
  startDelivery,
} from "../../services/deliveryService";

import toast from "react-hot-toast";
interface DeliveryOrder {
  orderId: number;
  customerName: string;
  phoneNumber: string;
  address: string;
  totalAmount: number;
  status: string;
}

export default function DeliveryPage() {
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);

  const [loading, setLoading] = useState(true);
  const [otp, setOtp] = useState("");

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getAssignedOrders();

        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Delivery Dashboard</h1>

      <div className="grid gap-4">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="bg-white border rounded-xl p-6 shadow-sm"
          >
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">Order #{order.orderId}</h2>

              <span
                className={`px-3 py-1 rounded-full ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <p>
                <strong>Customer:</strong> {order.customerName}
              </p>

              <p>
                <strong>Phone:</strong> {order.phoneNumber}
              </p>

              <p>
                <strong>Address:</strong> {order.address}
              </p>

              <p>
                <strong>Amount:</strong> ₹{order.totalAmount.toLocaleString()}
              </p>
            </div>

            {order.status === "Assigned" ? (
              <button
                onClick={async () => {
                  try {
                    await startDelivery(order.orderId);

                    toast.success("Delivery started");

                    window.location.reload();
                  } catch {
                    toast.error("Failed to start delivery");
                  }
                }}
                className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg"
              >
                Start Delivery
              </button>
            ) : order.status === "OutForDelivery" ? (
              <>
                <button
                  onClick={async () => {
                    try {
                      await sendDeliveryOtp(order.orderId);

                      setSelectedOrderId(order.orderId);

                      toast.success("OTP sent");
                    } catch {
                      toast.error("Failed to send OTP");
                    }
                  }}
                  className="mt-4 bg-primary text-on-primary px-4 py-2 rounded-lg"
                >
                  Request OTP
                </button>

                {selectedOrderId === order.orderId && (
                  <div className="mt-4 space-y-2">
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full border rounded-lg p-2"
                    />

                    <button
                      onClick={async () => {
                        try {
                          await verifyDeliveryOtp(order.orderId, otp);

                          toast.success("Delivery confirmed");

                          window.location.reload();
                        } catch {
                          toast.error("Invalid OTP");
                        }
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                      Confirm Delivery
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="mt-4">
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium">
                  ✓ Delivered
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
