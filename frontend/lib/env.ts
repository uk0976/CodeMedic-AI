const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const env = {
  apiUrl: apiUrl ?? "http://localhost:8000",
} as const;
