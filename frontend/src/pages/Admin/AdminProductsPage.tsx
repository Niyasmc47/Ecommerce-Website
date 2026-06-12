import { useEffect, useState } from "react";

import AdminLayout from "../../components/layouts/AdminLayout";
import ProductForm from "../../components/common/ProductForm";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";

import toast from "react-hot-toast";

import type { Product } from "../../types/product";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts({
          page: 1,
          pageSize: 100,
        });

        setProducts(data);
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  async function handleCreate(data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    categoryId: number;
  }) {
    try {
      await createProduct(data);

      const updated = await getProducts({
        page: 1,
        pageSize: 100,
      });

      setProducts(updated);

      setShowCreateForm(false);

      toast.success("Product created");
    } catch {
      toast.error("Create failed");
    }
  }

  async function handleUpdate(data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    categoryId: number;
  }) {
    if (!editingProduct) return;

    try {
      await updateProduct(editingProduct.id, data);

      const updated = await getProducts({
        page: 1,
        pageSize: 100,
      });

      setProducts(updated);

      setEditingProduct(null);

      toast.success("Product updated");
    } catch {
      toast.error("Update failed");
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Delete this product?");

    if (!confirmed) return;

    try {
      await deleteProduct(id);

      setProducts((current) => current.filter((p) => p.id !== id));

      toast.success("Product deleted");
    } catch {
      toast.error("Delete failed");
    }
  }
  return (
    <AdminLayout>
      <div className="py-16">
        <div
          className="
            mb-8
              flex
              items-center
              justify-between
            "
        >
          <h1
            className="
                text-4xl
                font-bold
              "
          >
            Product Management
          </h1>

          <button
            onClick={() => setShowCreateForm((current) => !current)}
            className="
                rounded-xl
                bg-blue-600
                px-5
                py-3
                text-white
                transition
                hover:bg-blue-700
              "
          >
            Add Product
          </button>
        </div>

        {showCreateForm && (
          <div
            className="
                mb-8
                rounded-2xl
                border
                border-slate-200
                p-6
                dark:border-slate-700
                dark:bg-slate-900
              "
          >
            <h2
              className="
                  mb-4
                  text-2xl
                  font-bold
                "
            >
              Create Product
            </h2>

            <ProductForm submitText="Create Product" onSubmit={handleCreate} />
          </div>
        )}

        {editingProduct && (
          <div
            className="
      mb-8
      rounded-2xl
      border
      border-slate-200
      p-6
      dark:border-slate-700
      dark:bg-slate-900
    "
          >
            <div
              className="
        mb-4
        flex
        items-center
        justify-between
      "
            >
              <h2
                className="
          text-2xl
          font-bold
        "
              >
                Edit Product
              </h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="
      rounded-lg
      border
      border-slate-200
      px-4
      py-2
      hover:bg-slate-100

      dark:border-slate-700
      dark:hover:bg-slate-800
    "
              >
                Cancel
              </button>
            </div>
            <ProductForm
              initialData={{
                name: editingProduct.name,
                description: editingProduct.description,
                price: editingProduct.price,
                stock: editingProduct.stock,
                imageUrl: editingProduct.imageUrl,
                categoryId: editingProduct.categoryId,
              }}
              submitText="Update Product"
              onSubmit={handleUpdate}
            />
          </div>
        )}

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6 w-full rounded-xl border border-slate-200 p-4 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />

        {loading ? (
          <div>Loading products...</div>
        ) : products.length === 0 ? (
          <div>No products found.</div>
        ) : (
          <div
            className="
                overflow-x-auto
                rounded-2xl
                border
              "
          >
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50 dark:bg-slate-950">
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Image</th>

                  <th className="p-4 text-left">Name</th>

                  <th className="p-4 text-left">Price</th>

                  <th className="p-4 text-left">Stock</th>

                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="p-4">{product.id}</td>
                    <td className="p-4">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="
      h-12
      w-12
      rounded-lg
      object-cover
    "
                      />
                    </td>

                    <td className="p-4">{product.name}</td>

                    <td className="p-4">₹{product.price}</td>

                    <td className="p-4">{product.stock}</td>

                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="
                              rounded-lg
                              bg-amber-500
                              px-3
                              py-2
                              text-white
                            "
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(product.id)}
                          className="
                              rounded-lg
                              bg-red-600
                              px-3
                              py-2
                              text-white
                            "
                        >
                          Delete
                        </button>
                      </div>
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
