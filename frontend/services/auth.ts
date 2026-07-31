import type { ApiMessage, AuthResponse } from "@/types/auth";
import { apiClient } from "./http";

export const authService = {
  login: (email: string, password: string, remember_me: boolean) => apiClient.request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify({ email, password, remember_me }) }),
  register: (full_name: string, email: string, password: string) => apiClient.request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify({ full_name, email, password }) }),
  demoLogin: () => apiClient.request<AuthResponse>("/auth/demo-login", { method: "POST" }),
  refresh: () => apiClient.request<AuthResponse>("/auth/refresh", { method: "POST" }),
  logout: () => apiClient.request<ApiMessage>("/auth/logout", { method: "POST" }),
  forgotPassword: (email: string) => apiClient.request<ApiMessage>("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
  resetPassword: (token: string, password: string) => apiClient.request<ApiMessage>("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password }) }),
  verifyEmail: (token: string) => apiClient.request<ApiMessage>("/auth/verify-email", { method: "POST", body: JSON.stringify({ token }) }),
} as const;
