import { useEffect, useState } from "react";

import AdminLayout from "../../components/layouts/AdminLayout";

import {
  getDashboardStats,
  getUsers,
  getOrders,
} from "../../services/adminService";

import {
  FaUsers,
  FaBox,
  FaShoppingCart,
} from "react-icons/fa";

import {
  FaIndianRupeeSign,
} from "react-icons/fa6";

import type { DashboardStats, AdminUser, AdminOrder } from "../../types/admin";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const [users, setUsers] = useState<AdminUser[]>([]);

  const [orders, setOrders] = useState<AdminOrder[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, usersData, ordersData] = await Promise.all([
          getDashboardStats(),
          getUsers(),
          getOrders(),
        ]);

        setStats(statsData);
        setUsers(usersData);
        setOrders(ordersData);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-20">Loading Admin Dashboard...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-16">
        <h1
          className="
              text-5xl
              font-bold
              dark:text-white
            "
        >
          Admin Dashboard
        </h1>

        {/* Stats Cards */}

        <div
          className="
              mt-10
              grid
              gap-6
              md:grid-cols-2
              lg:grid-cols-4
            "
        >
          <div className="rounded-2xl border border-slate-200 p-6 dark:border-slate-700 dark:bg-slate-900">
            <FaUsers className="mb-4 text-3xl" />

            <p className="text-slate-500 dark:text-slate-400">Users</p>

            <h2 className="mt-2 text-4xl font-bold">{stats?.totalUsers}</h2>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6 dark:border-slate-700 dark:bg-slate-900">
            <FaBox className="mb-4 text-3xl" />

            <p className="text-slate-500 dark:text-slate-400">Products</p>

            <h2 className="mt-2 text-4xl font-bold">{stats?.totalProducts}</h2>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6 dark:border-slate-700 dark:bg-slate-900">
            <FaShoppingCart className="mb-4 text-3xl" />

            <p className="text-slate-500 dark:text-slate-400">Orders</p>

            <h2 className="mt-2 text-4xl font-bold">{stats?.totalOrders}</h2>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6 dark:border-slate-700 dark:bg-slate-900">
            <FaIndianRupeeSign className="mb-4 text-3xl" />

            <p className="text-slate-500 dark:text-slate-400">Revenue</p>

            <h2 className="mt-2 text-3xl font-bold">₹{stats?.totalRevenue}</h2>
          </div>
        </div>

        {/* Users */}

        <div className="mt-16">
          <h2 className="mb-6 text-3xl font-bold">Users</h2>

          <div className="overflow-x-auto rounded-2xl border">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left">ID</th>

                  <th className="p-4 text-left">Name</th>

                  <th className="p-4 text-left">Email</th>

                  <th className="p-4 text-left">Role</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-4">{user.id}</td>

                    <td className="p-4">{user.name}</td>

                    <td className="p-4">{user.email}</td>

                    <td className="p-4">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Orders */}

        <div className="mt-16">
          <h2 className="mb-6 text-3xl font-bold">Orders</h2>

          <div className="overflow-x-auto rounded-2xl border">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left">ID</th>

                  <th className="p-4 text-left">Amount</th>

                  <th className="p-4 text-left">Status</th>

                  <th className="p-4 text-left">Date</th>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
