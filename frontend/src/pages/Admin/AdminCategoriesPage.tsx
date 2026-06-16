import { useEffect, useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";
import type { Category } from "../../types/category";
import toast from "react-hot-toast";
import { BsSearch, BsPencil, BsTrash, BsPlusLg } from "react-icons/bs";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    try {
      await createCategory({ name, imageUrl });
      setName("");
      setImageUrl("");
      await loadCategories();
      toast.success("Classification established");
    } catch {
      toast.error("Operation failed");
    }
  }

  async function handleUpdate() {
    if (!editingCategory) return;
    try {
      await updateCategory(editingCategory.id, { name, imageUrl });
      setEditingCategory(null);
      setName("");
      setImageUrl("");
      await loadCategories();
      toast.success("Classification updated");
    } catch {
      toast.error("Operation failed");
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Confirm termination of this classification?")) return;
    try {
      await deleteCategory(id);
      await loadCategories();
      toast.success("Classification terminated");
    } catch {
      toast.error("Termination failed");
    }
  }

  function startEdit(category: Category) {
    setEditingCategory(category);
    setName(category.name);
    setImageUrl(category.imageUrl);
  }

  function cancelEdit() {
    setEditingCategory(null);
    setName("");
    setImageUrl("");
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="py-10">
        <div className="mb-10">
           <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
             Classification Protocols
           </h1>
           <p className="text-foreground/50 font-mono mt-2 uppercase tracking-widest text-sm">Manage product categories</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
           
           {/* Form Section */}
           <div className="lg:col-span-4">
              <div className="rounded-3xl border border-border bg-surface p-6 premium-card shadow-sm sticky top-28">
                 <h2 className="mb-6 text-xl font-bold border-b border-border/50 pb-4">
                   {editingCategory ? "Modify Protocol" : "New Protocol"}
                 </h2>

                 <div className="space-y-4">
                   <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-foreground/50 mb-2">Protocol Identifier</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. GPU, Memory"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      />
                   </div>

                   <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-foreground/50 mb-2">Visual Asset URL</label>
                      <input
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      />
                   </div>

                   <div className="pt-4 flex gap-3">
                     <button
                       onClick={editingCategory ? handleUpdate : handleCreate}
                       className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-bold text-white transition-all hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/40 cyber-glow-hover"
                     >
                       {editingCategory ? <BsPencil size={14} /> : <BsPlusLg size={14} />}
                       {editingCategory ? "Update" : "Deploy"}
                     </button>
                     {editingCategory && (
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-3 rounded-xl border border-border font-bold hover:bg-background transition-colors"
                        >
                           Cancel
                        </button>
                     )}
                   </div>
                 </div>
              </div>
           </div>

           {/* List Section */}
           <div className="lg:col-span-8 space-y-6">
              
              <div className="relative">
                 <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                 <input
                   type="text"
                   placeholder="Scan classifications..."
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="w-full rounded-2xl border border-border bg-surface pl-11 pr-4 py-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all premium-card shadow-sm"
                 />
              </div>

              {loading ? (
                <div className="flex h-64 items-center justify-center border border-border rounded-3xl bg-surface premium-card">
                   <div className="flex flex-col items-center gap-4">
                      <div className="h-8 w-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                      <span className="font-mono text-xs uppercase tracking-widest text-primary animate-pulse">Scanning DB...</span>
                   </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-border bg-surface premium-card shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-background/50 font-mono text-xs uppercase text-foreground/50 border-b border-border">
                        <tr>
                          <th className="px-6 py-4 font-bold tracking-wider w-16">ID</th>
                          <th className="px-6 py-4 font-bold tracking-wider">Asset</th>
                          <th className="px-6 py-4 font-bold tracking-wider">Identifier</th>
                          <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {filteredCategories.map(category => (
                          <tr key={category.id} className="hover:bg-background/50 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-foreground/50">#{category.id}</td>
                            <td className="px-6 py-4">
                              <div className="h-12 w-12 rounded-xl bg-background border border-border overflow-hidden">
                                 <img
                                   src={category.imageUrl}
                                   alt={category.name}
                                   className="h-full w-full object-cover"
                                   onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                 />
                              </div>
                            </td>
                            <td className="px-6 py-4 font-bold text-foreground">
                              {category.name}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => startEdit(category)}
                                  className="inline-flex items-center justify-center p-2 rounded-lg bg-surface border border-border text-foreground hover:border-primary hover:text-primary transition-all"
                                  title="Modify"
                                >
                                  <BsPencil size={14} />
                                </button>
                                <button
                                  onClick={() => handleDelete(category.id)}
                                  className="inline-flex items-center justify-center p-2 rounded-lg bg-surface border border-border text-foreground hover:border-danger hover:text-danger hover:bg-danger/10 transition-all"
                                  title="Terminate"
                                >
                                  <BsTrash size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

           </div>
        </div>
      </div>
    </AdminLayout>
  );
}