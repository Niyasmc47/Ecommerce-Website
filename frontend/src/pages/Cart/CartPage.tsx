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
              Your Cart
            </span>

            <h1
              className="
            mt-6
            text-5xl
            font-bold
            tracking-tight
          "
            >
              Shopping Cart
            </h1>

            <p
              className="
            mt-4
            text-lg
            text-slate-500
            dark:text-slate-400
          "
            >
              Review your items before checkout.
            </p>
          </div>

          {loading ? (
            <p
              className="
            text-center
            text-slate-500
            dark:text-slate-400
          "
            >
              Loading...
            </p>
          ) : items.length === 0 ? (
            <div
              className="
            rounded-3xl
            bg-white
            dark:bg-slate-900
            p-12
            text-center
            shadow-sm
            ring-1
            ring-slate-200
            dark:ring-slate-700
          "
            >
              <h2
                className="
              text-2xl
              font-semibold
            "
              >
                Your cart is empty
              </h2>

              <p
                className="
              mt-3
              text-slate-500
              dark:text-slate-400
            "
              >
                Add products to start shopping.
              </p>
            </div>
          ) : (
            <div
              className="
            grid
            gap-8
            lg:grid-cols-3
          "
            >
              <div
                className="
              space-y-4
              lg:col-span-2
            "
              >
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="
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
                      flex
                      items-center
                      justify-between
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

                        <p
                          className="
                          mt-2
                          text-slate-500
                          dark:text-slate-400
                        "
                        >
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <div
                        className="
                        text-2xl
                        font-bold
                        dark:text-white
                      "
                      >
                        ₹{item.totalPrice}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div
                  className="
                sticky
                top-28
                rounded-3xl
                bg-white
                dark:bg-slate-900
                p-8
                shadow-sm
                ring-1
                ring-slate-200
                dark:ring-slate-700
              "
                >
                  <h2
                    className="
                  text-2xl
                  font-bold
                  dark:text-white
                "
                  >
                    Order Summary
                  </h2>

                  <div
                    className="
                  mt-6
                  flex
                  justify-between
                "
                  >
                    <span>Total</span>

                    <span
                      className="
                    text-2xl
                    font-bold
                    dark:text-white
                  "
                    >
                      ₹{total}
                    </span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="
                  mt-8
                  w-full
                  rounded-xl
                  bg-emerald-600
                  py-4
                  font-medium
                  text-white
                  transition
                  hover:bg-emerald-700
                "
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </MainLayout>
  );
}
