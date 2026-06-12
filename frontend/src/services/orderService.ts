import { api } from "../api/axios";

import type { Order } from "../types/order";

function getAuthHeaders() {
  const token =
    localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getOrders() {
  const response =
    await api.get<Order[]>(
      "/orders",
      {
        headers:
          getAuthHeaders(),
      }
    );

  return response.data;
}