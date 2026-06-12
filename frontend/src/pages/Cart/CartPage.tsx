import { useEffect, useState } from "react";

import MainLayout from "../../components/layouts/MainLayout";
import Container from "../../components/common/Container";

import toast from "react-hot-toast";

import { getCart, createOrder } from "../../services/cartService";

import type { CartItem } from "../../types/cartItem";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCart() {
      try {
        const data = await getCart();

        setItems(data);
      } finally {
        setLoading(false);
      }
    }

    loadCart();
  }, []);

  async function handleCheckout() {
    try {
      await createOrder();

      toast.success("Order created successfully");

      window.location.reload();
    } catch {
      toast.error("Checkout failed");
    }
  }

  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <MainLayout>
      <Container>
        <div className="py-16">
          <h1
            className="
              text-5xl
              font-bold
            "
          >
            Shopping Cart
          </h1>

          {loading ? (
            <p className="mt-8">Loading...</p>
          ) : items.length === 0 ? (
            <p className="mt-8">Your cart is empty.</p>
          ) : (
            <>
              <div className="mt-10 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="
                      flex
                      items-center
                      justify-between
                      rounded-xl
                      border
                      p-6
                    "
                  >
                    <div>
                      <h3
                        className="
                          text-xl
                          font-semibold
                        "
                      >
                        {item.productName}
                      </h3>

                      <p>Qty: {item.quantity}</p>
                    </div>

                    <div
                      className="
                        text-xl
                        font-bold
                      "
                    >
                      ₹{item.totalPrice}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="
                  mt-10
                  rounded-xl
                  border
                  p-6
                "
              >
                <h2
                  className="
                    text-2xl
                    font-bold
                  "
                >
                  Order Summary
                </h2>

                <div
                  className="
                    mt-4
                    flex
                    justify-between
                  "
                >
                  <span>Total</span>

                  <span
                    className="
                      font-bold
                    "
                  >
                    ₹{total}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="
                    mt-6
                    w-full
                    rounded-xl
                    bg-blue-600
                    py-4
                    text-white
                    transition
                    hover:bg-blue-700
                  "
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </Container>
    </MainLayout>
  );
}
