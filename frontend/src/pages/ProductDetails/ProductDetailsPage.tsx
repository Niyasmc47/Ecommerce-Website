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
        {" "}
        <Container>
          {" "}
          <div className="py-20">Loading... </div>{" "}
        </Container>{" "}
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        {" "}
        <Container>
          {" "}
          <div className="py-20">Product not found. </div>{" "}
        </Container>{" "}
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container>
        <div
          className="
        grid
        gap-16
        py-20
        lg:grid-cols-2
      "
        >
          <div>
            <div
              className="
            overflow-hidden
            rounded-3xl
            bg-white
            dark:bg-slate-900
            shadow-sm
            ring-1
            ring-slate-200
            dark:ring-slate-700
          "
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="
              h-full
              w-full
              object-cover
            "
              />
            </div>
          </div>

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
              In Stock
            </span>

            <h1
              className="
            mt-6
            text-5xl
            font-bold
            tracking-tight
            text-slate-900
            dark:text-white
          "
            >
              {product.name}
            </h1>

            <p
              className="
            mt-6
            text-lg
            leading-8
            text-slate-600
            dark:text-slate-300
          "
            >
              {product.description}
            </p>

            <div
              className="
            mt-10
            text-5xl
            font-bold
            tracking-tight
            text-slate-900
            dark:text-white
          "
            >
              ₹{product.price}
            </div>

            <div
              className="
            mt-4
            text-slate-500
            dark:text-slate-400
          "
            >
              Available Quantity: {product.stock}
            </div>

            <div
              className="
            mt-10
            flex
            gap-4
          "
            >
              <button
                onClick={handleAddToCart}
                className="
              rounded-xl
              bg-emerald-600
              px-8
              py-4
              font-medium
              text-white
              transition
              hover:bg-emerald-700
            "
              >
                Add To Cart
              </button>

              <button
                className="
              rounded-xl
              border
              border-slate-200
              bg-white
              dark:bg-slate-900
              px-8
              py-4
              font-medium
              transition
              hover:bg-slate-50
              dark:border-slate-700
              dark:text-white
              dark:hover:bg-slate-800
            "
              >
                Buy Now
              </button>
            </div>

            <div
              className="
            mt-12
            rounded-3xl
            bg-slate-50
            dark:bg-slate-950
            p-6
          "
            >
              <h3
                className="
              text-lg
              font-semibold
              dark:text-white
            "
              >
                Product Highlights
              </h3>

              <ul
                className="
              mt-4
              space-y-3
              text-slate-600
              dark:text-slate-300
            "
              >
                <li>✓ Premium quality product</li>

                <li>✓ Fast shipping available</li>

                <li>✓ Secure checkout</li>

                <li>✓ Customer support included</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </MainLayout>
  );
}
