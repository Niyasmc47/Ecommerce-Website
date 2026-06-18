import { useEffect, useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import {
  getAllSellers,
  createSeller,
  updateSeller,
  deleteSeller,
} from "../../services/adminSellerService";
import { getUsers } from "../../services/adminService";
import toast from "react-hot-toast";
import type { Seller } from "../../types/seller";
import type { AdminUser } from "../../types/admin";
import {
  BsSearch,
  BsShop,
  BsCheckCircle,
  BsXCircle,
  BsPauseCircle,
  BsTrash,
} from "react-icons/bs";

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Create form state
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newLogoUrl, setNewLogoUrl] = useState("");
  const [newUserId, setNewUserId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [sellersData, usersData] = await Promise.all([
        getAllSellers(),
        getUsers(),
      ]);
      setSellers(sellersData);
      setUsers(usersData);
    } finally {
      setLoading(false);
    }
  }

  const availableUsers = users.filter(
    (u) =>
      !sellers.some((s) => s.userId === u.id) &&
      (u.role === "User" || u.role === "Seller"),
  );

  const filteredSellers = sellers.filter(
    (s) =>
      s.companyName.toLowerCase().includes(search.toLowerCase()) ||
      s.userEmail.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleCreate() {
    if (!newCompanyName.trim() || !newUserId) {
      toast.error("Company name and user are required");
      return;
    }
    try {
      await createSeller({
        companyName: newCompanyName,
        description: newDescription,
        logoUrl: newLogoUrl || undefined,
        userId: Number(newUserId),
      });
      toast.success("Seller created");
      setShowCreateForm(false);
      setNewCompanyName("");
      setNewDescription("");
      setNewLogoUrl("");
      setNewUserId("");
      await loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create seller");
    }
  }

  async function handleToggleSuspend(seller: Seller) {
    try {
      await updateSeller(seller.id, {
        companyName: seller.companyName,
        description: seller.description,
        logoUrl: seller.logoUrl,
        isApproved: seller.isApproved,
        isSuspended: !seller.isSuspended,
      });
      toast.success(
        seller.isSuspended ? "Seller reactivated" : "Seller suspended",
      );
      await loadData();
    } catch {
      toast.error("Failed to update seller");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this seller? Their products will become unowned."))
      return;
    try {
      await deleteSeller(id);
      toast.success("Seller deleted");
      await loadData();
    } catch {
      toast.error("Failed to delete seller");
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
            <span className="font-mono text-xs uppercase tracking-widest text-primary animate-pulse">
              Loading Sellers...
            </span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              Sellers
            </h1>
            <p className="text-foreground/50 font-mono mt-2 uppercase tracking-widest text-sm">
              Manage marketplace vendors
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center justify-center rounded-lg bg-primary hover:opacity-90 text-white px-6 py-3 text-sm font-bold transition-all"
          >
            {showCreateForm ? "Cancel" : "+ Add Seller"}
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="rounded-2xl border border-primary/30 bg-surface p-8 mb-8 shadow-sm">
            <h3 className="text-lg font-bold mb-6">Create New Seller</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-foreground/50 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
                  placeholder="e.g. Apple Store"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-foreground/50 mb-2">
                  Assign User *
                </label>
                <select
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
                >
                  <option value="">Select a user</option>
                  {availableUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-mono uppercase tracking-widest text-foreground/50 mb-2">
                Description
              </label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary min-h-[80px]"
                placeholder="Brief company description..."
              />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-mono uppercase tracking-widest text-foreground/50 mb-2">
                Logo URL
              </label>
              <input
                type="text"
                value={newLogoUrl}
                onChange={(e) => setNewLogoUrl(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
                placeholder="https://..."
              />
            </div>
            <button
              onClick={handleCreate}
              className="bg-primary text-white px-6 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all"
            >
              Create Seller
            </button>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-8">
          <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            placeholder="Search sellers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-border bg-surface pl-11 pr-4 py-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all premium-card shadow-sm"
          />
        </div>

        {/* Sellers Table */}
        <div className="rounded-3xl border border-border bg-surface premium-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-background/50 font-mono text-xs uppercase text-foreground/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">
                    Seller
                  </th>
                  <th className="px-6 py-4 font-bold tracking-wider">Owner</th>
                  <th className="px-6 py-4 font-bold tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-4 font-bold tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 font-bold tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 font-bold tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredSellers.map((seller) => (
                  <tr
                    key={seller.id}
                    className="hover:bg-background/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {seller.logoUrl ? (
                            <img
                              src={seller.logoUrl}
                              alt={seller.companyName}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <BsShop className="text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">
                            {seller.companyName}
                          </p>
                          <p className="text-xs text-foreground/50">
                            {seller.totalProducts} products
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-foreground text-xs">
                          {seller.userName}
                        </p>
                        <p className="text-xs text-foreground/50">
                          {seller.userEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono">
                      {seller.totalProducts}
                    </td>
                    <td className="px-6 py-4">
                      {seller.isSuspended ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold font-mono uppercase tracking-widest bg-error/10 text-error border border-error/20">
                          <BsPauseCircle size={10} /> Suspended
                        </span>
                      ) : seller.isApproved ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold font-mono uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                          <BsCheckCircle size={10} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold font-mono uppercase tracking-widest bg-secondary/10 text-secondary border border-secondary/20">
                          <BsXCircle size={10} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-foreground/50 font-mono text-xs">
                      {new Date(seller.createdDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleSuspend(seller)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                            seller.isSuspended
                              ? "border-primary bg-primary/10 text-primary hover:bg-primary/20"
                              : "border-secondary bg-secondary/10 text-secondary hover:bg-secondary/20"
                          }`}
                        >
                          {seller.isSuspended ? "Reactivate" : "Suspend"}
                        </button>
                        <button
                          onClick={() => handleDelete(seller.id)}
                          className="p-1.5 rounded-lg text-error/70 hover:text-error hover:bg-error/10 transition-all"
                        >
                          <BsTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredSellers.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-foreground/40"
                    >
                      No sellers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
