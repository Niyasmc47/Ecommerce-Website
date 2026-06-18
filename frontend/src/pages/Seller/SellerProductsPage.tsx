import { useEffect, useState } from "react";
import SellerLayout from "../../components/layouts/SellerLayout";
import ProductForm from "../../components/common/ProductForm";
import {
  getSellerProducts,
  createSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
} from "../../services/sellerService";
import toast from "react-hot-toast";
import type { Product } from "../../types/product";
import { BsSearch, BsTrash } from "react-icons/bs";

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await getSellerProducts();
      setProducts(data);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(data: any) {
    try {
      await createSellerProduct(data);
      await loadProducts();
      setShowCreateForm(false);
      toast.success("Product created");
    } catch {
      toast.error("Failed to create product");
    }
  }

  async function handleUpdate(data: any) {
    if (!editingProduct) return;
    try {
      await updateSellerProduct(editingProduct.id, data);
      await loadProducts();
      setEditingProduct(null);
      toast.success("Product updated");
    } catch {
      toast.error("Failed to update product");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteSellerProduct(id);
      await loadProducts();
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  }

  return (
    <SellerLayout>
      {showCreateForm || editingProduct ? (
        <div className="py-10">
          <div className="mb-10 rounded-3xl border border-primary/30 bg-surface/80 backdrop-blur-xl p-8 premium-card shadow-2xl relative z-20">
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
                  submitText="Create Product"
                  onSubmit={handleCreate}
                  onCancel={() => setShowCreateForm(false)}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Your Products
              </h1>
              <p className="text-foreground/60 text-sm mt-1">
                Manage your product catalog
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center justify-center rounded-lg bg-primary hover:opacity-90 text-white px-6 py-3 text-sm font-bold transition-all"
            >
              + Add Product
            </button>
          </div>

          <div className="relative mb-8">
            <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              placeholder="Search your products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-border bg-surface pl-11 pr-4 py-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all premium-card shadow-sm"
            />
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center border border-border rounded-2xl bg-surface">
              <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                <span className="font-mono text-xs uppercase tracking-widest text-primary animate-pulse">
                  Loading Products...
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-background/50 font-mono text-xs uppercase text-foreground/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-bold tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-4 font-bold tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 font-bold tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-4 font-bold tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-background/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-md bg-background border border-border overflow-hidden shrink-0">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </div>
                            <div>
                              <p className="font-bold text-foreground">
                                {product.name}
                              </p>
                              <p className="text-xs text-foreground/50 mt-0.5">
                                SKU: {product.sku || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono">
                          ₹
                          {product.price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                product.stock > 10
                                  ? "bg-primary"
                                  : product.stock > 0
                                    ? "bg-secondary"
                                    : "bg-error"
                              }`}
                            ></span>
                            <span className="text-sm">{product.stock}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                window.scrollTo({
                                  top: 0,
                                  behavior: "smooth",
                                });
                              }}
                              className="px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-bold hover:bg-background transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-1.5 rounded-lg text-error/70 hover:text-error hover:bg-error/10 transition-all"
                            >
                              <BsTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-12 text-center text-foreground/40"
                        >
                          No products yet. Create your first listing!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </SellerLayout>
  );
}
