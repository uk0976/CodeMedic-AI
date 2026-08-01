import { env } from "@/lib/env";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init: RequestInit = {}, accessToken?: string): Promise<T> {
  try {
    const response = await fetch(`${env.apiUrl}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...init.headers,
      },
    });
    const body = (await response.json().catch(() => ({}))) as { detail?: string } & T;
    if (!response.ok)
      throw new ApiError(body.detail ?? "Something went wrong. Please retry.", response.status);
    return body;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Network error. Check your connection and retry.", 0);
  }
}

export const apiClient = { request, baseUrl: env.apiUrl } as const;
