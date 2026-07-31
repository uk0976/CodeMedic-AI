export type UserRole = "user" | "evaluator" | "admin";

export type AuthUser = {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: "bearer";
  user: AuthUser;
};

export type ApiMessage = { message: string };
