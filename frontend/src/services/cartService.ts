import { api } from "../api/axios";
import type { CartItem } from "../types/cartItem";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function addToCart(productId: number, quantity: number) {
  return api.post(
    "/cart",
    {
      productId,
      quantity,
    },
    {
      headers: getAuthHeaders(),
    },
  );
}

export async function getCart() {
  const response = await api.get<CartItem[]>("/cart", {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function createOrder() {
  return api.post(
    "/orders",
    {},
    {
      headers: getAuthHeaders(),
    },
  );
}
