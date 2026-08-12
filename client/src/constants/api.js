export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const AUTH_ENDPOINTS = {
  login: "/auth/login",
  register: "/auth/register",
  logout: "/auth/logout",
};

export const MENU_ENDPOINTS = {
  list: "/menus",
  detail: (id) => `/menus/${id}`,
  create: "/menus",
  update: (id) => `/menus/${id}`,
  delete: (id) => `/menus/${id}`,
  bulkDelete: "/menus/bulk-delete",
};

export const CATEGORY_ENDPOINTS = {
  list: "/categories",
  detail: (id) => `/categories/${id}`,
  create: "/categories",
  update: (id) => `/categories/${id}`,
  delete: (id) => `/categories/${id}`,
};