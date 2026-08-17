import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import * as authService from "../services/auth.service";

import {
  AUTH_USER_KEY,
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from "../utils/localStorage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    getStorageItem(AUTH_USER_KEY)
  );

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mencegah React StrictMode melakukan restore session 2x
  const restoreStarted = useRef(false);

  useEffect(() => {
    // React StrictMode di development bisa menjalankan effect 2x.
    if (restoreStarted.current) {
      return;
    }

    restoreStarted.current = true;

    const restoreSession = async () => {
      /*
       * Kalau tidak ada user tersimpan, berarti memang belum login.
       * Jangan request /profile.
       *
       * Ini yang menghilangkan:
       * GET /api/auth/profile 401
       * saat membuka halaman login.
       */
      const storedUser = getStorageItem(AUTH_USER_KEY);

      if (!storedUser) {
        setUser(null);
        setError(null);
        setIsLoading(false);
        return;
      }

      try {
        const freshUser = await authService.getMe();

        setUser(freshUser);
        setStorageItem(AUTH_USER_KEY, freshUser);
        setError(null);
      } catch (err) {
        /*
         * axios.js kamu mengubah AxiosError menjadi Error biasa
         * dan menyimpan HTTP status di err.status.
         *
         * JADI JANGAN PAKAI:
         * err.response.status
         *
         * Gunakan:
         * err.status
         */
        if (err?.status === 401) {
          setUser(null);
          removeStorageItem(AUTH_USER_KEY);
          setError(null);
          return;
        }

        console.error(
          "Failed to restore authentication session:",
          err
        );

        setUser(null);
        removeStorageItem(AUTH_USER_KEY);
        setError(
          err?.message ||
            "Gagal memulihkan session."
        );
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(async (credentials) => {
    setError(null);

    try {
      const result = await authService.login(credentials);

      setUser(result.user);
      setStorageItem(
        AUTH_USER_KEY,
        result.user
      );

      return result.user;
    } catch (err) {
      setError(
        err?.message ||
          "Gagal login."
      );

      throw err;
    }
  }, []);

  const register = useCallback(async (payload) => {
    setError(null);

    try {
      const result =
        await authService.register(payload);

      return result.user;
    } catch (err) {
      setError(
        err?.message ||
          "Gagal mendaftar."
      );

      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      removeStorageItem(AUTH_USER_KEY);
      setError(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      role: user?.role || null,
      isAuthenticated: Boolean(user),
      isLoading,
      error,
      login,
      register,
      logout,
    }),
    [
      user,
      isLoading,
      error,
      login,
      register,
      logout,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}