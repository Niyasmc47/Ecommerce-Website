import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import AdminLayout from "../../components/layouts/AdminLayout";

import {
  getTicket,
  addReply,
  closeTicket,
} from "../../services/supportService";

export default function AdminSupportTicketPage() {
  const { id } = useParams();

  const [ticket, setTicket] = useState<any>(null);

  const [message, setMessage] = useState("");

  async function load() {
    if (!id) return;

    const data = await getTicket(Number(id));

    setTicket(data);
  }

  useEffect(() => {
    load();
  }, [id]);

  async function handleReply() {
    if (!message.trim()) {
      return;
    }

    try {
      await addReply(Number(id), message);

      setMessage("");

      await load();

      toast.success("Reply sent");
    } catch {
      toast.error("Failed to send reply");
    }
  }

  async function handleClose() {
    if (!window.confirm("Close this ticket?")) {
      return;
    }

    try {
      await closeTicket(Number(id));

      await load();

      toast.success("Ticket closed");
    } catch {
      toast.error("Failed to close ticket");
    }
  }

  if (!ticket) {
    return (
      <AdminLayout>
        <div className="p-8">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Ticket #{ticket.id}</h1>

            <p className="text-slate-500 mt-2">{ticket.subject}</p>

            <p className="text-slate-500">Customer: {ticket.customerName}</p>
          </div>

          {ticket.status === "Open" && (
            <button
              onClick={handleClose}
              className="
                bg-red-600
                text-white
                px-4
                py-2
                rounded-lg
              "
            >
              Close Ticket
            </button>
          )}
        </div>

        <div
          className="
            border
            rounded-xl
            bg-white
            p-6
            space-y-4
          "
        >
          {ticket.messages?.map((msg: any) => (
            <div
              key={msg.id}
              className="
                  border-b
                  pb-4
                "
            >
              <div
                className="
                    font-semibold
                  "
              >
                {msg.senderName}
              </div>

              <div className="mt-2">{msg.message}</div>

              <div
                className="
                    text-xs
                    text-slate-500
                    mt-2
                  "
              >
                {new Date(msg.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {ticket.status === "Open" && (
          <div className="mt-6">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Reply to customer..."
              className="
                w-full
                border
                rounded-xl
                p-4
              "
            />

            <button
              onClick={handleReply}
              className="
                mt-4
                bg-blue-600
                text-white
                px-5
                py-3
                rounded-lg
              "
            >
              Send Reply
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
