import axiosInstance from "./axios";
import { CATEGORY_ENDPOINTS } from "../constants/api";

function mapCategory(c) {
  return {
    id: c.ID,
    name: c.Name,
    menuCount: c.MenuCount ?? 0,
  };
}

export async function getCategories({ search = "", page = 1, pageSize = 8 } = {}) {
  const { data } = await axiosInstance.get(CATEGORY_ENDPOINTS.list);
  const all = (data.data || []).map(mapCategory);

  const filtered = search
    ? all.filter((c) => c.name.toLowerCase().includes(search.trim().toLowerCase()))
    : all;

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const dataPage = filtered.slice(start, start + pageSize);

  return { data: dataPage, total };
}

export async function getCategoryById(id) {
  const { data } = await axiosInstance.get(CATEGORY_ENDPOINTS.detail(id));
  return {
    ...mapCategory(data.data),
    menus: data.data.Menus || [],
  };
}

export async function createCategory(payload) {
  const { data } = await axiosInstance.post(CATEGORY_ENDPOINTS.create, {
    Name: payload.name,
  });
  return mapCategory(data.data);
}

export async function updateCategory(id, payload) {
  const { data } = await axiosInstance.put(CATEGORY_ENDPOINTS.update(id), {
    Name: payload.name,
  });
  return mapCategory(data.data);
}

export async function deleteCategory(id) {
  const { data } = await axiosInstance.delete(CATEGORY_ENDPOINTS.delete(id));
  return data;
}

// Name-based options - used by list/filter Selects (Manage Menus, Menu
// Ingredients, Reservation pre-order) that filter by category NAME.
export async function getCategoryOptions() {
  const { data } = await axiosInstance.get(CATEGORY_ENDPOINTS.list);
  return (data.data || []).map((c) => ({ value: c.Name, label: c.Name }));
}

// ID-based options - used specifically by the Menu create/edit form, since
// the backend's Menu create/update endpoints require a numeric CategoryID.
export async function getCategoryOptionsWithId() {
  const { data } = await axiosInstance.get(CATEGORY_ENDPOINTS.list);
  return (data.data || []).map((c) => ({ value: String(c.ID), label: c.Name }));
}
