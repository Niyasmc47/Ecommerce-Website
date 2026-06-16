import { useEffect, useState, useMemo } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import ProductForm from "../../components/common/ProductForm";
import {
  getProducts,
  createProduct,
  updateProduct,
} from "../../services/productService";
import toast from "react-hot-toast";
import type { Product } from "../../types/product";
import { BsSearch, BsBell, BsEnvelope, BsFilter, BsDownload, BsChevronLeft, BsChevronRight } from "react-icons/bs";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) || 
    product.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = useMemo(() => products.filter(p => p.stock > 0 && p.stock <= 10).length, [products]);
  const revenueForecast = useMemo(() => products.reduce((sum, p) => sum + (p.price * p.stock), 0), [products]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts({ page: 1, pageSize: 100 });
        setProducts(data);
      } catch {
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  async function handleCreate(data: any) {
    try {
      await createProduct(data);
      const updated = await getProducts({ page: 1, pageSize: 100 });
      setProducts(updated);
      setShowCreateForm(false);
      toast.success("Product created");
    } catch {
      toast.error("Registration failed");
    }
  }

  async function handleUpdate(data: any) {
    if (!editingProduct) return;
    try {
      await updateProduct(editingProduct.id, data);
      const updated = await getProducts({ page: 1, pageSize: 100 });
      setProducts(updated);
      setEditingProduct(null);
      toast.success("Product updated");
    } catch {
      toast.error("Modification failed");
    }
  }

  return (
    <AdminLayout>
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-8">
         <div className="relative w-96">
            <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50" />
            <input
              type="text"
              placeholder="Search products, SKUs, or categor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-border bg-surface pl-11 pr-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
         </div>
         <div className="flex items-center gap-6 text-foreground/70">
            <button className="hover:text-foreground transition-colors"><BsBell size={20} /></button>
            <button className="hover:text-foreground transition-colors"><BsEnvelope size={20} /></button>
            <div className="flex items-center gap-3 border-l border-border pl-6">
               <img src="https://ui-avatars.com/api/?name=Alex+Rivera&background=random" alt="Admin" className="w-8 h-8 rounded-full border border-border" />
               <div className="hidden md:block">
                  <p className="text-sm font-bold text-foreground">Alex Rivera</p>
                  <p className="text-[10px] font-mono uppercase tracking-widest">Senior Admin</p>
               </div>
            </div>
         </div>
      </div>

      {(showCreateForm || editingProduct) ? (
         <div className="mb-10 rounded-3xl border border-primary/30 bg-surface/80 backdrop-blur-xl p-8 premium-card shadow-2xl relative z-20 cyber-glow">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[50px] pointer-events-none"></div>
            <div className="relative z-10">
               {editingProduct ? (
                 <ProductForm
                   initialData={editingProduct}
                   submitText="Save Product"
                   onSubmit={handleUpdate}
                   onCancel={() => setEditingProduct(null)}
                 />
               ) : (
                 <ProductForm 
                   submitText="Save Product" 
                   onSubmit={handleCreate} 
                   onCancel={() => setShowCreateForm(false)}
                 />
               )}
            </div>
         </div>
      ) : (
        <>
          {/* Header & Actions */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
             <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Product Inventory</h1>
                <p className="text-foreground/60 text-sm mt-1">Manage your catalog, stock levels, and technical specifications.</p>
             </div>
             <div className="flex gap-3">
                <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-bold transition-all hover:bg-background">
                  <BsFilter /> Filters
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-bold transition-all hover:bg-background">
                  <BsDownload /> Export
                </button>
             </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                <p className="text-xs font-mono font-bold uppercase tracking-widest text-foreground/50 mb-2">Total Products</p>
                <h2 className="text-4xl font-bold">{products.length.toLocaleString()}</h2>
                <p className="text-xs text-primary font-bold mt-2">↗ +12% from last month</p>
             </div>
             <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
                <p className="text-xs font-mono font-bold uppercase tracking-widest text-secondary mb-2">Low Stock Alert</p>
                <h2 className="text-4xl font-bold">{lowStockCount}</h2>
                <p className="text-xs text-secondary font-bold mt-2">! Action required</p>
             </div>
             <div className="bg-surface border border-border rounded-xl p-6 shadow-sm relative overflow-hidden">
                <p className="text-xs font-mono font-bold uppercase tracking-widest text-foreground/50 mb-2">Revenue Forecast</p>
                <h2 className="text-4xl font-bold">₹{revenueForecast.toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
                {/* Decorative Chart Bars */}
                <div className="absolute right-6 bottom-6 flex items-end gap-1 opacity-20">
                   <div className="w-2 bg-foreground h-4 rounded-t-sm"></div>
                   <div className="w-2 bg-foreground h-8 rounded-t-sm"></div>
                   <div className="w-2 bg-foreground h-6 rounded-t-sm"></div>
                   <div className="w-2 bg-foreground h-10 rounded-t-sm"></div>
                   <div className="w-2 bg-foreground h-12 rounded-t-sm"></div>
                </div>
             </div>
          </div>

          {loading ? (
             <div className="flex h-64 items-center justify-center border border-border rounded-2xl bg-surface premium-card">
                <div className="flex flex-col items-center gap-4">
                   <div className="h-8 w-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                   <span className="font-mono text-xs uppercase tracking-widest text-primary animate-pulse">Scanning Inventory...</span>
                </div>
             </div>
          ) : (
            <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-background/50 font-mono text-xs uppercase text-foreground/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-bold tracking-wider">Product</th>
                      <th className="px-6 py-4 font-bold tracking-wider">Category</th>
                      <th className="px-6 py-4 font-bold tracking-wider">Price</th>
                      <th className="px-6 py-4 font-bold tracking-wider">Stock Status</th>
                      <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filteredProducts.map((product) => (
                      <tr 
                        key={product.id} 
                        className="hover:bg-background/50 transition-colors cursor-pointer"
                        onClick={() => {
                           setEditingProduct(product);
                           window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-md bg-background border border-border overflow-hidden shrink-0">
                               <img
                                 src={product.imageUrl}
                                 alt={product.name}
                                 className="h-full w-full object-cover"
                                 onError={(e) => { e.currentTarget.style.display = 'none'; }}
                               />
                            </div>
                            <div>
                               <p className="font-bold text-foreground">{product.name}</p>
                               <p className="text-xs text-foreground/50 mt-0.5">SKU: {product.sku || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex border border-border/50 bg-background/50 px-2 py-1 rounded text-xs text-foreground/70">
                             {product.categoryId === 1 ? 'Electronics' : product.categoryId === 2 ? 'Footwear' : 'Accessories'}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono">
                          ₹{product.price.toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${
                                 product.stock > 10 ? 'bg-primary' : 
                                 product.stock > 0 ? 'bg-secondary' : 
                                 'bg-danger'
                              }`}></span>
                              <span className="text-sm">
                                 {product.stock > 10 ? `In Stock (${product.stock})` : 
                                  product.stock > 0 ? `Low Stock (${product.stock})` : 
                                  'Out of Stock'}
                              </span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="text-foreground/40 hover:text-foreground transition-colors p-2">
                             ...
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Bar */}
              <div className="border-t border-border bg-background/30 px-6 py-4 flex items-center justify-between">
                 <p className="text-sm text-foreground/60">
                    Showing 1 to {Math.min(filteredProducts.length, 10)} of {filteredProducts.length.toLocaleString()} products
                 </p>
                 <div className="flex gap-1">
                    <button className="w-8 h-8 flex items-center justify-center rounded-md border border-border bg-surface text-foreground hover:bg-background transition-colors">
                       <BsChevronLeft size={12} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md bg-primary text-white font-bold transition-colors">
                       1
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md border border-transparent hover:bg-surface text-foreground transition-colors">
                       2
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md border border-transparent hover:bg-surface text-foreground transition-colors">
                       3
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-md border border-border bg-surface text-foreground hover:bg-background transition-colors">
                       <BsChevronRight size={12} />
                    </button>
                 </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Expose method to trigger form externally from sidebar */}
      <button 
        id="trigger-create-product" 
        className="hidden" 
        onClick={() => {
          setShowCreateForm(true);
          setEditingProduct(null);
        }}
      />
    </AdminLayout>
  );
}
