"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "@/services/auth";
import type { AuthResponse, AuthUser } from "@/types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<AuthResponse>;
  signUp: (name: string, email: string, password: string) => Promise<AuthResponse>;
  enterDemo: () => Promise<AuthResponse>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const apply = useCallback((response: AuthResponse) => { setUser(response.user); setAccessToken(response.access_token); return response; }, []);
  useEffect(() => { authService.refresh().then(apply).catch(() => undefined).finally(() => setIsLoading(false)); }, [apply]);
  const value = useMemo<AuthContextValue>(() => ({
    user, accessToken, isLoading,
    signIn: async (email, password, rememberMe) => apply(await authService.login(email, password, rememberMe)),
    signUp: async (name, email, password) => apply(await authService.register(name, email, password)),
    enterDemo: async () => apply(await authService.demoLogin()),
    signOut: async () => { try { await authService.logout(); } finally { setUser(null); setAccessToken(null); } },
  }), [accessToken, apply, isLoading, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
