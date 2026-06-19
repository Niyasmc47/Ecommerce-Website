import { useEffect, useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import {
  getDeliveryAgents,
  assignDeliveryAgent,
  getAllDeliveries,
} from "../../services/adminDeliveryService";

import toast from "react-hot-toast";

export default function DeliveryManagementPage() {
  const [agents, setAgents] = useState<any[]>([]);

  const [orders, setOrders] = useState<any[]>([]);

  const [orderId, setOrderId] = useState("");

  const [agentId, setAgentId] = useState("");

  async function load() {
    setAgents(await getDeliveryAgents());

    setOrders(await getAllDeliveries());
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAssign() {
    try {
      await assignDeliveryAgent(Number(orderId), Number(agentId));

      toast.success("Delivery updated");

      load();
    } catch {
      toast.error("Failed");
    }
  }

  return (
    <AdminLayout>
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Delivery Management</h1>

      <div className="bg-white border rounded-xl p-6 mb-8">
        <select
          className="w-full border p-3 rounded-lg mb-3"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        >
          <option value="">Select Order</option>

          {orders.map((o) => (
            <option key={o.orderId} value={o.orderId}>
              #{o.orderId}-{o.customerName}-{o.status}
            </option>
          ))}
        </select>

        <select
          className="w-full border p-3 rounded-lg mb-3"
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
        >
          <option value="">Select Delivery Agent</option>

          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleAssign}
          className="bg-primary text-on-primary px-5 py-2 rounded-lg"
        >
          Assign / Reassign
        </button>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-bold text-xl mb-4">Assigned Deliveries</h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th>Order</th>
              <th>Customer</th>
              <th>Agent</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o.orderId} className="border-b text-center">
                <td>#{o.orderId}</td>

                <td>{o.customerName}</td>

                <td>{o.deliveryAgentName}</td>

                <td>{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </AdminLayout>
  );
}
