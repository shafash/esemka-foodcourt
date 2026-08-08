export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const AUTH_ENDPOINTS = {
  login: "/auth/login",
  register: "/auth/register",
  logout: "/auth/logout",
};
