import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import MainLayout from "../../components/layouts/MainLayout";
import Container from "../../components/common/Container";
import ProductCard from "../../components/cards/ProductCard";

import { getProducts } from "../../services/productService";

import type { Product } from "../../types/product";

export default function ProductsPage() {
  const [searchParams] =
    useSearchParams();

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState(
      () =>
        searchParams.get("search") || ""
    );

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [page, setPage] =
    useState(1);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);

        const data =
          await getProducts({
            search,
            minPrice:
              minPrice !== ""
                ? Number(minPrice)
                : undefined,
            maxPrice:
              maxPrice !== ""
                ? Number(maxPrice)
                : undefined,
            page,
            pageSize: 12,
          });

        setProducts(data);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [
    search,
    minPrice,
    maxPrice,
    page,
  ]);

  return (
    <MainLayout>
      <Container>
        <div className="py-20">
          <div
            className="
          mb-12
          text-center
        "
          >
            <span
              className="
            rounded-full
            bg-emerald-100
            px-4
            py-2
            text-sm
            font-medium
            text-emerald-700
          "
            >
              Product Collection
            </span>

            <h1
              className="
            mt-6
            text-5xl
            font-bold
            tracking-tight
            text-slate-900
            dark:text-white
            md:text-6xl
          "
            >
              Explore Products
            </h1>

            <p
              className="
            mx-auto
            mt-4
            max-w-2xl
            text-lg
            text-slate-500
            dark:text-slate-400
          "
            >
              Browse smartphones, laptops, gaming gear, accessories and more.
            </p>
          </div>

          <div
            className="
          mb-12
          rounded-3xl
          bg-white
          dark:bg-slate-900
          p-6
          shadow-sm
          ring-1
          ring-slate-200
          dark:ring-slate-700
        "
          >
            <div
              className="
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
              border-slate-200
              bg-slate-50
              dark:bg-slate-950
              p-4
              dark:border-slate-700
              dark:text-white
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
              border-slate-200
              bg-slate-50
              dark:bg-slate-950
              p-4
              dark:border-slate-700
              dark:text-white
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
              border-slate-200
              bg-slate-50
              dark:bg-slate-950
              p-4
              dark:border-slate-700
              dark:text-white
            "
              />
            </div>
          </div>

          {loading ? (
            <div
              className="
            mt-10
            text-center
            text-slate-500
            dark:text-slate-400
          "
            >
              Loading products...
            </div>
          ) : (
            <div
              className="
            grid
            gap-8
            md:grid-cols-2
            lg:grid-cols-4
          "
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div
            className="
          mt-16
          flex
          items-center
          justify-center
          gap-4
        "
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="
            rounded-xl
            bg-white
            dark:bg-slate-900
            px-5
            py-3
            shadow-sm
            ring-1
            ring-slate-200
            dark:ring-slate-700
            transition
            hover:bg-slate-50
            dark:hover:bg-slate-800
          "
            >
              Previous
            </button>

            <span
              className="
            font-medium
            text-slate-600
            dark:text-slate-300
          "
            >
              Page {page}
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              className="
            rounded-xl
            bg-emerald-600
            px-5
            py-3
            font-medium
            text-white
            transition
            hover:bg-emerald-700
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
