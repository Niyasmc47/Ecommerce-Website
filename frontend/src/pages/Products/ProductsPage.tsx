import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import MainLayout from "../../components/layouts/MainLayout";
import Container from "../../components/common/Container";
import ProductCard from "../../components/cards/ProductCard";

import { getProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import type { Category } from "../../types/category";
import type { Product } from "../../types/product";
import { BsSearch, BsFilterRight } from "react-icons/bs";

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await getProducts({
          search,
          minPrice: minPrice !== "" ? Number(minPrice) : undefined,
          maxPrice: maxPrice !== "" ? Number(maxPrice) : undefined,
          page,
          pageSize: 12,
        });
        setProducts(data);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [search, minPrice, maxPrice, page]);

  useEffect(() => {
    async function loadCategories() {
      const data = await getCategories();

      setCategories(data);
    }

    loadCategories();
  }, []);

  const filteredProducts =
    selectedCategories.length === 0
      ? products
      : products.filter((product) =>
          selectedCategories.includes(product.categoryId),
        );

  function toggleCategory(categoryId: number) {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  }

  return (
    <MainLayout>
      <div className="bg-background min-h-screen">
        <Container className="max-w-[1700px]">
          <div className="py-20">
            <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-primary mb-4">
                  Our Products
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
                  All Products.
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-foreground/60 leading-relaxed">
                  Browse our full index of products and accessories.
                </p>
              </div>
            </div>

            <div className="mb-12 rounded-3xl bg-surface border border-border p-6 shadow-sm premium-card">
              <div className="flex items-center gap-2 mb-4 text-foreground/70 font-bold uppercase tracking-wider text-xs font-mono border-b border-border/50 pb-4">
                <BsFilterRight size={18} /> Search & Filters
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="relative">
                  <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                  <input
                    type="text"
                    placeholder="Search systems..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 font-mono">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="Minimum spec price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background pl-8 pr-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 font-mono">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="Maximum spec price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background pl-8 pr-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:items-start">
              {/* Sidebar */}
              <div className="hidden lg:block">
  <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-3xl border border-border bg-surface p-6 premium-card">
                {" "}
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-bold text-lg text-foreground">
                    Categories
                  </h3>

                  <button
                    onClick={() => setSelectedCategories([])}
                    className="text-xs text-primary hover:underline"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex cursor-pointer items-center justify-between rounded-xl p-2 hover:bg-background"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                          className="h-4 w-4 accent-primary"
                        />

                        <span className="text-sm text-foreground">
                          {category.name}
                        </span>
                      </div>

                      <span className="text-xs text-foreground/50">
                        {
                          products.filter((p) => p.categoryId === category.id)
                            .length
                        }
                      </span>
                    </label>
                  ))}
                </div>
                </div>
              </div>

              {/* Products */}
              <div>
                {loading ? (
                  <div className="flex h-64 items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>

                      <span className="font-mono text-xs uppercase tracking-widest text-primary animate-pulse">
                        Scanning Archive...
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    {filteredProducts.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-foreground/40 border-2 border-dashed border-border rounded-3xl bg-surface/50">
                        <span className="text-4xl mb-4">📡</span>

                        <p className="font-mono text-sm uppercase tracking-widest">
                          No matching products found.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="mb-8 flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-foreground">
                              Products
                            </h3>

                            <p className="text-sm text-foreground/60">
                              Showing {filteredProducts.length} products
                            </p>
                          </div>

                          {selectedCategories.length > 0 && (
                            <button
                              onClick={() => setSelectedCategories([])}
                              className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary hover:text-primary transition-colors"
                            >
                              Clear Filters
                            </button>
                          )}
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                          {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="mt-16 flex items-center justify-center gap-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-full bg-surface border border-border px-6 py-2 text-sm font-bold transition hover:bg-background hover:border-primary hover:text-primary disabled:opacity-50 disabled:hover:border-border disabled:hover:text-foreground"
              >
                &larr; Prev
              </button>

              <span className="font-mono text-sm font-bold text-foreground/60 uppercase tracking-widest">
                Sector {page}
              </span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={products.length < 12}
                className="rounded-full bg-surface border border-border px-6 py-2 text-sm font-bold transition hover:bg-background hover:border-primary hover:text-primary disabled:opacity-50 disabled:hover:border-border disabled:hover:text-foreground"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
}
