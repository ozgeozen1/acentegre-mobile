import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSegments, router } from 'expo-router';
import * as authStore from '@/src/store/authStore';
import { login as apiLogin, type LoginResponse } from '@/src/api/auth';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  rol?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();

  // Restore session on mount
  useEffect(() => {
    (async () => {
      try {
        const savedToken = await authStore.getToken();
        const savedUser = await authStore.getUser();
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(savedUser);
        }
      } catch (e) {
        console.warn('Auth restore failed:', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Route guard
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === ('login' as string);
    const isAuthenticated = !!token;

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login' as never);
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)' as never);
    }
  }, [token, segments, isLoading]);

  const login = useCallback(async (email: string, password: string) => {
    const res: LoginResponse = await apiLogin(email, password);
    await authStore.setToken(res.access_token);
    await authStore.setUser(res.user);
    setToken(res.access_token);
    setUser(res.user);
  }, []);

  const logout = useCallback(async () => {
    await authStore.clearAll();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
