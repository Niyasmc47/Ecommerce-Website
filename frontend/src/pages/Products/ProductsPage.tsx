import { useEffect, useState } from "react";

import MainLayout from "../../components/layouts/MainLayout";
import Container from "../../components/common/Container";
import ProductCard from "../../components/cards/ProductCard";

import { getProducts } from "../../services/productService";

import type { Product } from "../../types/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

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

  return (
    <MainLayout>
      <Container>
        <div className="py-16">
          <h1 className="text-5xl font-bold">Products</h1>

          <p className="mt-3 text-slate-500">Browse our collection.</p>

          {/* Filters */}

          <div
            className="
              mt-10
              grid
              gap-4
              md:grid-cols-3
            "
          >
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                rounded-xl
                border
                p-4
              "
            />

            <input
              type="number"
              placeholder="Minimum price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="
                rounded-xl
                border
                p-4
              "
            />

            <input
              type="number"
              placeholder="Maximum price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="
                rounded-xl
                border
                p-4
              "
            />
          </div>

          {/* Products */}

          {loading ? (
            <div className="mt-10">Loading products...</div>
          ) : (
            <div
              className="
                mt-10
                grid
                gap-6
                md:grid-cols-2
                lg:grid-cols-4
              "
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}

          <div
            className="
              mt-12
              flex
              justify-center
              gap-4
            "
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="
                rounded-xl
                border
                px-5
                py-2
              "
            >
              Previous
            </button>

            <span className="flex items-center">Page {page}</span>

            <button
              onClick={() => setPage((p) => p + 1)}
              className="
                rounded-xl
                border
                px-5
                py-2
              "
            >
              Next
            </button>
          </div>
        </div>
      </Container>
    </MainLayout>
  );
}
