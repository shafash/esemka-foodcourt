import { useCallback, useMemo, useState } from "react";
import { AuthContext } from "./auth-context";
import * as authService from "../services/auth.service";
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from "../utils/localStorage";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStorageItem(AUTH_USER_KEY));
  const [token, setToken] = useState(() => getStorageItem(AUTH_TOKEN_KEY));
  const [isLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (credentials) => {
    setError(null);
    try {
      const result = await authService.login(credentials);
      setUser(result.user);
      setStorageItem(AUTH_USER_KEY, result.user);
      if (result.token) {
        setToken(result.token);
        setStorageItem(AUTH_TOKEN_KEY, result.token);
      }
      return result.user;
    } catch (err) {
      setError(err.message || "Gagal login.");
      throw err;
    }
  }, []);

  const register = useCallback(async (payload) => {
    setError(null);
    try {
      const result = await authService.register(payload);
      return result.user;
    } catch (err) {
      setError(err.message || "Gagal mendaftar.");
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setToken(null);
      removeStorageItem(AUTH_TOKEN_KEY);
      removeStorageItem(AUTH_USER_KEY);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      role: user?.role || null,
      isAuthenticated: Boolean(user && token),
      isLoading,
      error,
      login,
      register,
      logout,
    }),
    [user, token, isLoading, error, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}