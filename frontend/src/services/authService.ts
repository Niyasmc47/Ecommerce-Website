import { api } from "../api/axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export async function login(data: LoginRequest) {
  const response = await api.post("/auth/login", data);

  return response.data;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export async function register(
  data: RegisterRequest
) {
  const response =
    await api.post(
      "/auth/register",
      data
    );

  return response.data;
}
