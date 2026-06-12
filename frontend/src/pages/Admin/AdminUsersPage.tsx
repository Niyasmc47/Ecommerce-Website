import { useEffect, useState } from "react";

import AdminLayout
from "../../components/layouts/AdminLayout";

import { getUsers }
from "../../services/adminService";

import type { AdminUser }
from "../../types/admin";

export default function AdminUsersPage() {

  const [users, setUsers] =
    useState<AdminUser[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {

    async function load() {

      try {

        const data =
          await getUsers();

        setUsers(data);

      } finally {

        setLoading(false);

      }
    }

    load();

  }, []);

  const filteredUsers =
    users.filter(user =>
      user.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
      user.email
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  if (loading) {

    return (
      <AdminLayout>
        Loading users...
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
          dark:text-white
        "
      >
        Users
      </h1>

      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        className="
          mb-6
          w-full
          rounded-xl
          border
          border-slate-200
          p-4
          dark:border-slate-700
          dark:bg-slate-950
          dark:text-white
        "
      />

      <div
        className="
          overflow-x-auto
          rounded-2xl
          border
          border-slate-200
          dark:border-slate-700
        "
      >

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="p-4 text-left">
                ID
              </th>

              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                Email
              </th>

              <th className="p-4 text-left">
                Role
              </th>

              <th className="p-4 text-left">
                Created
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredUsers.map(user => (

              <tr
                key={user.id}
                className="border-b"
              >

                <td className="p-4">
                  {user.id}
                </td>

                <td className="p-4">
                  {user.name}
                </td>

                <td className="p-4">
                  {user.email}
                </td>

                <td className="p-4">
                  {user.role}
                </td>

                <td className="p-4">
                  {
                    new Date(
                      user.createdDate
                    ).toLocaleDateString()
                  }
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </AdminLayout>

  );
}