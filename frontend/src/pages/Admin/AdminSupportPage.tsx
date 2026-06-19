import { useEffect, useState } from "react";

import AdminLayout from "../../components/layouts/AdminLayout";

import { getAllTickets } from "../../services/supportService";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await getAllTickets();

      setTickets(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Support Tickets</h1>

          <p className="text-slate-500 mt-2">
            Manage customer support requests
          </p>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="overflow-hidden rounded-xl border bg-white">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 text-left">Ticket</th>

                  <th className="p-4 text-left">Customer</th>

                  <th className="p-4 text-left">Subject</th>

                  <th className="p-4 text-left">Status</th>

                  <th className="p-4 text-left">Created</th>

                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-t">
                    <td className="p-4 font-semibold">#{ticket.id}</td>

                    <td className="p-4">{ticket.customerName}</td>

                    <td className="p-4">{ticket.subject}</td>

                    <td className="p-4">
                      <span
                        className={`
    px-3
    py-1
    rounded-full
    text-xs
    font-medium
    ${
      ticket.status === "Open"
        ? "bg-green-100 text-green-700"
        : "bg-slate-100 text-slate-700"
    }
  `}
                      >
                        {ticket.status}
                      </span>
                    </td>

                    <td className="p-4">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      <a
                        href={`/admin/support/${ticket.id}`}
                        className="
                          text-blue-600
                          hover:underline
                        "
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
