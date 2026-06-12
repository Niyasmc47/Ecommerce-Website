import { useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import MainLayout from "../../components/layouts/MainLayout";
import Container from "../../components/common/Container";

import {
  createOrder,
  type CheckoutRequest,
} from "../../services/cartService";

export default function CheckoutPage() {
  const navigate = useNavigate();

  const [form, setForm] =
    useState<CheckoutRequest>({
      fullName: "",
      phoneNumber: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      paymentMethod: "COD",
    });

  const [loading, setLoading] =
    useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      await createOrder(form);

      toast.success(
        "Order placed successfully"
      );

      navigate("/orders");
    } catch {
      toast.error(
        "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout>
      <Container>
        <div
          className="
            mx-auto
            max-w-3xl
            py-20
          "
        >
          <h1
            className="
              text-center
              text-5xl
              font-bold
            "
          >
            Checkout
          </h1>

          <p
            className="
              mt-4
              text-center
              text-slate-500
            "
          >
            Enter your shipping
            details.
          </p>

          <form
            onSubmit={handleSubmit}
            className="
              mt-12
              space-y-5
            "
          >
            <input
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              className="
                w-full
                rounded-xl
                border
                p-4
              "
              required
            />

            <input
              name="phoneNumber"
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={handleChange}
              className="
                w-full
                rounded-xl
                border
                p-4
              "
              required
            />

            <input
              name="addressLine1"
              placeholder="Address Line 1"
              value={form.addressLine1}
              onChange={handleChange}
              className="
                w-full
                rounded-xl
                border
                p-4
              "
              required
            />

            <input
              name="addressLine2"
              placeholder="Address Line 2"
              value={form.addressLine2}
              onChange={handleChange}
              className="
                w-full
                rounded-xl
                border
                p-4
              "
            />

            <input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="
                w-full
                rounded-xl
                border
                p-4
              "
              required
            />

            <input
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              className="
                w-full
                rounded-xl
                border
                p-4
              "
              required
            />

            <input
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
              className="
                w-full
                rounded-xl
                border
                p-4
              "
              required
            />

            <input
              name="postalCode"
              placeholder="Postal Code"
              value={form.postalCode}
              onChange={handleChange}
              className="
                w-full
                rounded-xl
                border
                p-4
              "
              required
            />

            <select
              name="paymentMethod"
              value={
                form.paymentMethod
              }
              onChange={handleChange}
              className="
                w-full
                rounded-xl
                border
                p-4
              "
            >
              <option value="COD">
                Cash On Delivery
              </option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                rounded-xl
                bg-emerald-600
                py-4
                font-medium
                text-white
                hover:bg-emerald-700
              "
            >
              {loading
                ? "Placing Order..."
                : "Place Order"}
            </button>
          </form>
        </div>
      </Container>
    </MainLayout>
  );
}