import { api } from "../api/axios";
import type { Product } from "../types/product";
import type { ProductQuery } from "../types/productQuery";

export async function getProducts(query?: ProductQuery): Promise<Product[]> {
  const response = await api.get<Product[]>("/products", {
    params: query,
  });

  return response.data;
}

export async function getProductById(id: number): Promise<Product> {
  const response = await api.get<Product>(`/products/${id}`);

  return response.data;
}

export async function createProduct(product: {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: number;
}) {
  const token = localStorage.getItem("token");

  const response = await api.post("/products", product, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function updateProduct(
  id: number,
  product: {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    categoryId: number;
  },
) {
  const token = localStorage.getItem("token");

  const response = await api.put(`/products/${id}`, product, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function deleteProduct(id: number) {
  const token = localStorage.getItem("token");

  return api.delete(`/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
