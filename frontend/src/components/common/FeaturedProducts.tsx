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
    <section className="py-20">
      <Container>
        <div className="mb-10">
          <h2
            className="
            text-4xl
            font-bold
            "
          >
            Featured Products
          </h2>

          <p
            className="
            mt-2
            text-slate-500
            "
          >
            Discover our most popular items.
          </p>
        </div>

        <div
          className="
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
      </Container>
    </section>
  );
}
