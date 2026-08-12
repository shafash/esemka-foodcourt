import axiosInstance from "./axious";
import { MENU_ENDPOINTS } from "../constants/api";
import { unwrapApiData } from "./apiHelper";

function normalizeMenu(menu) {
  if (!menu) return null;

  return {
    id: menu.ID ?? menu.id,
    name: menu.Name ?? menu.name,
    category: menu.Category ?? menu.category,
    categoryId: menu.CategoryID ?? menu.categoryId ?? null,
    description: menu.Description ?? menu.description ?? "",
    price: Number(menu.Price ?? menu.price ?? 0),
    imageUrl: menu.Image ?? menu.imageUrl ?? null,
  };
}

function normalizeMenuList(payload) {
  const responseData = unwrapApiData(payload) ?? {};
  const menus = (responseData.menus || responseData.data || []).map(normalizeMenu);
  const pagination = responseData.pagination || null;
  return {
    data: menus,
    total: pagination?.totalData ?? menus.length,
  };
}

export async function getMenus(params) {
  const { data } = await axiosInstance.get(MENU_ENDPOINTS.list, {
    params: {
      page: params?.page ?? 1,
      limit: params?.pageSize ?? 10,
      search: params?.search ?? "",
    },
  });

  return normalizeMenuList(data);
}

export async function getMenuById(id) {
  const response = await axiosInstance.get(MENU_ENDPOINTS.detail(id));
  return normalizeMenu(unwrapApiData(response));
}

export async function createMenu(payload) {
  const formData = new FormData();
  formData.append("CategoryID", payload.categoryId ?? payload.categoryID ?? "");
  formData.append("Name", payload.name ?? "");
  formData.append("Description", payload.description ?? "");
  formData.append("Price", String(Number(payload.price || 0)));
  if (payload.imageFile) {
    formData.append("image", payload.imageFile);
  }

  const response = await axiosInstance.post(MENU_ENDPOINTS.create, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return normalizeMenu(unwrapApiData(response));
}

export async function updateMenu(id, payload) {
  const formData = new FormData();
  formData.append("CategoryID", payload.categoryId ?? payload.categoryID ?? "");
  formData.append("Name", payload.name ?? "");
  formData.append("Description", payload.description ?? "");
  formData.append("Price", String(Number(payload.price || 0)));
  if (payload.imageFile) {
    formData.append("image", payload.imageFile);
  }

  const response = await axiosInstance.put(MENU_ENDPOINTS.update(id), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return normalizeMenu(unwrapApiData(response));
}

export async function deleteMenu(id) {
  await axiosInstance.delete(MENU_ENDPOINTS.delete(id));
  return true;
}

export async function bulkDeleteMenus(ids) {
  if (!Array.isArray(ids) || ids.length === 0) {
    return true;
  }

  await Promise.all(ids.map((id) => axiosInstance.delete(MENU_ENDPOINTS.delete(id))));
  return true;
}

export function countMenusByCategory(categoryName) {
  return 0;
}