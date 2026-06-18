import { useEffect, useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import { getUsers, updateUserRole } from "../../services/adminService";
import toast from "react-hot-toast";
import type { AdminUser } from "../../types/admin";
import { BsSearch, BsShieldCheck, BsFunnel, BsTruck, BsShop } from "react-icons/bs";

const ROLE_OPTIONS = ["User", "DeliveryAgent", "Seller", "Admin"] as const;

const ROLE_STYLES: Record<string, string> = {
  Admin: "bg-primary/20 text-primary border border-primary/30",
  Seller: "bg-tertiary/20 text-tertiary border border-tertiary/30",
  DeliveryAgent: "bg-secondary/20 text-secondary border border-secondary/30",
  User: "bg-surface border border-border text-foreground/70",
};

const ROLE_ICONS: Record<string, React.ReactNode> = {
  Admin: <BsShieldCheck className="text-primary" />,
  Seller: <BsShop className="text-tertiary" />,
  DeliveryAgent: <BsTruck className="text-secondary" />,
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [confirmAction, setConfirmAction] = useState<{
    userId: number;
    userName: string;
    currentRole: string;
    newRole: string;
  } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getUsers();
        setUsers(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleRoleChange(userId: number, newRole: string) {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    // Show confirmation dialog
    setConfirmAction({
      userId,
      userName: user.name,
      currentRole: user.role,
      newRole,
    });
  }

  async function confirmRoleChange() {
    if (!confirmAction) return;

    try {
      await updateUserRole(confirmAction.userId, confirmAction.newRole);
      setUsers(
        users.map((user) =>
          user.id === confirmAction.userId
            ? { ...user, role: confirmAction.newRole }
            : user,
        ),
      );
      toast.success(`Role updated to ${confirmAction.newRole}`);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Role update failed";
      toast.error(typeof message === "string" ? message : "Role update failed");
    } finally {
      setConfirmAction(null);
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleCounts = users.reduce(
    (acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
            <span className="font-mono text-xs uppercase tracking-widest text-primary animate-pulse">
              Loading Users...
            </span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Users
          </h1>
          <p className="text-foreground/50 font-mono mt-2 uppercase tracking-widest text-sm">
            Manage users and role assignments
          </p>
        </div>

        {/* Role Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <button
            onClick={() => setRoleFilter("All")}
            className={`rounded-xl border p-4 text-left transition-all ${
              roleFilter === "All"
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-surface hover:bg-background"
            }`}
          >
            <p className="text-xs font-mono uppercase tracking-widest text-foreground/50">
              All Users
            </p>
            <p className="text-2xl font-bold mt-1">{users.length}</p>
          </button>
          {ROLE_OPTIONS.map((role) => (
            <button
              key={role}
              onClick={() =>
                setRoleFilter(roleFilter === role ? "All" : role)
              }
              className={`rounded-xl border p-4 text-left transition-all ${
                roleFilter === role
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-surface hover:bg-background"
              }`}
            >
              <p className="text-xs font-mono uppercase tracking-widest text-foreground/50">
                {role === "DeliveryAgent" ? "Agents" : role + "s"}
              </p>
              <p className="text-2xl font-bold mt-1">
                {roleCounts[role] || 0}
              </p>
            </button>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-border bg-surface pl-11 pr-4 py-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all premium-card shadow-sm"
            />
          </div>
          <div className="relative">
            <BsFunnel className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-2xl border border-border bg-surface pl-11 pr-8 py-4 text-sm font-bold outline-none cursor-pointer transition-all premium-card shadow-sm appearance-none"
            >
              <option value="All">All Roles</option>
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-surface premium-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-background/50 font-mono text-xs uppercase text-foreground/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider w-16">
                    ID
                  </th>
                  <th className="px-6 py-4 font-bold tracking-wider">User</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Email</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Role</th>
                  <th className="px-6 py-4 font-bold tracking-wider">
                    Registered
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-background/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-foreground/50">
                      #{user.id}
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground flex items-center gap-2">
                      {ROLE_ICONS[user.role]}
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-foreground/70">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        className={`rounded-lg border px-3 py-1.5 text-xs font-bold font-mono uppercase tracking-widest outline-none cursor-pointer transition-all ${
                          ROLE_STYLES[user.role] || ROLE_STYLES.User
                        }`}
                      >
                        {ROLE_OPTIONS.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-foreground/50 font-mono text-xs">
                      {new Date(user.createdDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-foreground mb-2">
              Confirm Role Change
            </h3>
            <p className="text-foreground/70 mb-6">
              Change <span className="font-bold text-foreground">{confirmAction.userName}</span>'s role from{" "}
              <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase tracking-widest ${ROLE_STYLES[confirmAction.currentRole]}`}>
                {confirmAction.currentRole}
              </span>{" "}
              to{" "}
              <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase tracking-widest ${ROLE_STYLES[confirmAction.newRole]}`}>
                {confirmAction.newRole}
              </span>
              ?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-5 py-2.5 rounded-xl border border-border bg-surface text-sm font-bold hover:bg-background transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmRoleChange}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 transition-all"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
