import { useEffect, useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import { getUsers, updateUserRole } from "../../services/adminService";
import toast from "react-hot-toast";
import type { AdminUser } from "../../types/admin";
import { BsSearch, BsShieldCheck } from "react-icons/bs";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  async function handleRoleChange(userId: number, role: string) {
    try {
      await updateUserRole(userId, role);
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role } : user,
        ),
      );
      toast.success("Clearance level updated");
    } catch {
      toast.error("Clearance modification failed");
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
       <AdminLayout>
         <div className="flex h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
               <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
               <span className="font-mono text-xs uppercase tracking-widest text-primary animate-pulse">Loading Users...</span>
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
           <p className="text-foreground/50 font-mono mt-2 uppercase tracking-widest text-sm">Manage system access levels</p>
        </div>

        <div className="relative mb-8">
           <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
           <input
             type="text"
             placeholder="Search personnel..."
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="w-full rounded-2xl border border-border bg-surface pl-11 pr-4 py-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all premium-card shadow-sm"
           />
        </div>

        <div className="rounded-3xl border border-border bg-surface premium-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-background/50 font-mono text-xs uppercase text-foreground/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider w-16">ID</th>
                  <th className="px-6 py-4 font-bold tracking-wider">User</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Email</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Clearance</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Registration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-foreground/50">#{user.id}</td>
                    <td className="px-6 py-4 font-bold text-foreground flex items-center gap-2">
                       {user.role === 'Admin' && <BsShieldCheck className="text-primary" />}
                       {user.name}
                    </td>
                    <td className="px-6 py-4 text-foreground/70">{user.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-bold font-mono uppercase tracking-widest outline-none cursor-pointer transition-all ${
                           user.role === 'Admin' ? 'bg-primary/10 text-primary border-primary/30' : 'bg-surface border-border text-foreground/70'
                        }`}
                      >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
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
    </AdminLayout>
  );
}
