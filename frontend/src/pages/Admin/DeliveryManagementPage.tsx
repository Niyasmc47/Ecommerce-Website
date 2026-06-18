import { useEffect, useState } from "react";

import {
  getDeliveryAgents,
  assignDeliveryAgent,
} from "../../services/adminDeliveryService";

import toast from "react-hot-toast";

interface DeliveryAgent {
  id: number;
  name: string;
  email: string;
}

export default function DeliveryManagementPage() {
  const [agents, setAgents] =
    useState<DeliveryAgent[]>([]);

  const [orderId, setOrderId] =
    useState("");

  const [selectedAgent,
    setSelectedAgent] =
      useState("");

  useEffect(() => {
    async function load() {
      const data =
        await getDeliveryAgents();

      setAgents(data);
    }

    load();
  }, []);

  async function handleAssign() {
    try {
      await assignDeliveryAgent(
        Number(orderId),
        Number(selectedAgent)
      );

      toast.success(
        "Order reassigned"
      );
    } catch {
      toast.error(
        "Failed to assign"
      );
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">
        Delivery Management
      </h1>

      <div className="bg-white border rounded-xl p-6 space-y-4">
        <input
          type="number"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) =>
            setOrderId(
              e.target.value
            )
          }
          className="w-full border p-3 rounded-lg"
        />

        <select
          value={selectedAgent}
          onChange={(e) =>
            setSelectedAgent(
              e.target.value
            )
          }
          className="w-full border p-3 rounded-lg"
        >
          <option value="">
            Select Delivery Agent
          </option>

          {agents.map((agent) => (
            <option
              key={agent.id}
              value={agent.id}
            >
              {agent.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleAssign}
          className="bg-primary text-on-primary px-4 py-2 rounded-lg"
        >
          Assign Agent
        </button>
      </div>
    </div>
  );
}