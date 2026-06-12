import { useEffect, useState } from "react";

import ProductCard from "../cards/ProductCard";

import type { Product } from "../../types/product";
import { getProducts } from "../../services/productService";

import Container from "./Container";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <section
      className="
    bg-slate-50
    py-24

    dark:bg-slate-950
  "
    >
      <Container>
        <div
          className="
        mb-14
        flex
        items-end
        justify-between
      "
        >
          <div>
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
              Featured Collection
            </span>

            <h2
              className="
            mt-5
            text-5xl
            font-bold
            tracking-tight
            text-slate-900

            dark:text-white
          "
            >
              Popular Products
            </h2>

            <p
              className="
            mt-4
            max-w-2xl
            text-lg
            text-slate-500

            dark:text-slate-400
          "
            >
              Discover our most popular products chosen by customers.
            </p>
          </div>
        </div>

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
      </Container>
    </section>
  );
}
