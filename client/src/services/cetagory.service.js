import axiosInstance from "./axious";
import { CATEGORY_ENDPOINTS } from "../constants/api";
import { unwrapApiData } from "./apiHelper";

function normalizeCategory(category) {
  if (!category) return null;

  return {
    id: category.ID ?? category.id,
    name: category.Name ?? category.name,
    description: category.Description ?? category.description ?? "",
    createdAt: category.CreatedAt ?? category.createdAt ?? null,
    menuCount: category.MenuCount ?? category.menuCount ?? 0,
  };
}

function normalizeCategoryList(response) {
  const list = unwrapApiData(response) ?? [];
  const data = Array.isArray(list) ? list : list?.data ?? [];
  return {
    data: data.map(normalizeCategory),
    total: list?.total ?? data.length,
  };
}

export async function getCategories(params) {
  const { data } = await axiosInstance.get(CATEGORY_ENDPOINTS.list, {
    params: {
      page: params?.page ?? 1,
      limit: params?.pageSize ?? 10,
      search: params?.search ?? "",
    },
  });

  return normalizeCategoryList(data);
}

export async function getCategoryById(id) {
  const response = await axiosInstance.get(CATEGORY_ENDPOINTS.detail(id));
  return normalizeCategory(unwrapApiData(response));
}

export async function createCategory(payload) {
  const response = await axiosInstance.post(CATEGORY_ENDPOINTS.create, {
    Name: payload.name,
    Description: payload.description,
  });
  return normalizeCategory(unwrapApiData(response));
}

export async function updateCategory(id, payload) {
  const response = await axiosInstance.put(CATEGORY_ENDPOINTS.update(id), {
    Name: payload.name,
    Description: payload.description,
  });
  return normalizeCategory(unwrapApiData(response));
}

export async function deleteCategory(id) {
  await axiosInstance.delete(CATEGORY_ENDPOINTS.delete(id));
  return true;
}

export async function getCategoryOptions() {
  const { data } = await axiosInstance.get(CATEGORY_ENDPOINTS.list, {
    params: { page: 1, limit: 100 },
  });

  const list = unwrapApiData(data) ?? [];
  const categories = Array.isArray(list) ? list : list?.data ?? [];
  return categories.map((category) => ({ value: category.ID, label: category.Name ?? category.name }));
}