import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import toast from "react-hot-toast";

import MainLayout from "../../components/layouts/MainLayout";
import Container from "../../components/common/Container";

import { getProductById } from "../../services/productService";
import { addToCart } from "../../services/cartService";

import type { Product } from "../../types/product";

export default function ProductDetailsPage() {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;

      try {
        const data = await getProductById(Number(id));

        setProduct(data);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  async function handleAddToCart() {
    if (!product) return;

    try {
      await addToCart(product.id, 1);

      toast.success("Added to cart");
    } catch {
      toast.error("Please login first");
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <Container>
          <div className="py-20">Loading...</div>
        </Container>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <Container>
          <div className="py-20">Product not found.</div>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container>
        <div
          className="
            grid
            gap-12
            py-20
            lg:grid-cols-2
          "
        >
          <div>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="
                w-full
                rounded-3xl
                border
              "
            />
          </div>

          <div>
            <h1
              className="
                text-5xl
                font-bold
              "
            >
              {product.name}
            </h1>

            <p
              className="
                mt-6
                text-lg
                text-slate-600
              "
            >
              {product.description}
            </p>

            <div
              className="
                mt-8
                text-4xl
                font-bold
              "
            >
              ₹{product.price}
            </div>

            <div
              className="
                mt-4
                text-slate-500
              "
            >
              Stock: {product.stock}
            </div>

            <button
              onClick={handleAddToCart}
              className="
                mt-10
                rounded-xl
                bg-blue-600
                px-8
                py-4
                text-white
                transition
                hover:bg-blue-700
              "
            >
              Add To Cart
            </button>
          </div>
        </div>
      </Container>
    </MainLayout>
  );
}
