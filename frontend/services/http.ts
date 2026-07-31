import { env } from "@/lib/env";

export const apiClient = {
  baseUrl: env.apiUrl,
} as const;
