export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const AUTH_ENDPOINTS = {
  login: "/auth/login",
  register: "/auth/register",
  profile: "/auth/profile",
};

export const MENU_ENDPOINTS = {
  list: "/menus",
  detail: (id) => `/menus/${id}`,
  create: "/menus",
  update: (id) => `/menus/${id}`,
  delete: (id) => `/menus/${id}`,
};

export const CATEGORY_ENDPOINTS = {
  list: "/categories",
  detail: (id) => `/categories/${id}`,
  create: "/categories",
  update: (id) => `/categories/${id}`,
  delete: (id) => `/categories/${id}`,
};

export const USER_ENDPOINTS = {
  list: "/users",
  detail: (id) => `/users/${id}`,
  create: "/users",
  update: (id) => `/users/${id}`,
  delete: (id) => `/users/${id}`,
};

export const INGREDIENT_ENDPOINTS = {
  list: "/ingredients",
  detail: (id) => `/ingredients/${id}`,
  create: "/ingredients",
  update: (id) => `/ingredients/${id}`,
  delete: (id) => `/ingredients/${id}`,
};

export const UNIT_ENDPOINTS = {
  list: "/units",
  detail: (id) => `/units/${id}`,
  create: "/units",
  update: (id) => `/units/${id}`,
  delete: (id) => `/units/${id}`,
};

export const MENU_INGREDIENT_ENDPOINTS = {
  list: "/menuIngredients",
  detail: (id) => `/menuIngredients/${id}`,
  create: "/menuIngredients",
  update: (id) => `/menuIngredients/${id}`,
  delete: (id) => `/menuIngredients/${id}`,
};

export const TABLE_ENDPOINTS = {
  list: "/tables",
  detail: (id) => `/tables/${id}`,
};

export const RESERVATION_ENDPOINTS = {
  list: "/reservations",
  detail: (id) => `/reservations/${id}`,
  create: "/reservations",
  update: (id) => `/reservations/${id}`,
  delete: (id) => `/reservations/${id}`,
  me: "/reservations/me",
  meDetail: (id) => `/reservations/me/${id}`,
  meCancel: (id) => `/reservations/me/${id}/cancel`,
};