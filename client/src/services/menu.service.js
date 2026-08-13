import axiosInstance from "./axious";
import { MENU_ENDPOINTS, API_BASE_URL } from "../constants/api";

// Backend serves uploaded menu images statically from /uploads (see
// server/src/app.js: app.use("/uploads", express.static("uploads"))).
// API_BASE_URL already includes the "/api" suffix, so strip it to get
// the server's origin for building a usable <img> URL.
const SERVER_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

function buildImageUrl(filename) {
  if (!filename) return null;
  if (filename.startsWith("http")) return filename;
  return `${SERVER_ORIGIN}/uploads/menus/${filename}`;
}

function mapMenu(m) {
  return {
    id: m.ID,
    name: m.Name,
    category: m.Category, // category NAME, for list/display
    categoryId: m.CategoryID, // numeric id, for the edit form Select
    price: Number(m.Price),
    description: m.Description,
    imageUrl: buildImageUrl(m.Image),
  };
}

export async function getMenus({ search = "", category = "", page = 1, pageSize = 9 } = {}) {
  const { data } = await axiosInstance.get(MENU_ENDPOINTS.list, {
    params: { search, page, limit: pageSize },
  });

  let items = (data.data.menus || []).map(mapMenu);

  // NOTE: the backend's GET /menus does not support filtering by category
  // at all (only a Name "search" query param exists). Category filtering
  // is therefore applied client-side, against the current page only.
  if (category) {
    items = items.filter((m) => m.category === category);
  }

  return { data: items, total: data.data.pagination?.totalData ?? 0 };
}

export async function getMenuById(id) {
  const { data } = await axiosInstance.get(MENU_ENDPOINTS.detail(id));
  const menu = mapMenu(data.data);
  // The edit form's Select is ID-based (see MenuForm.jsx), so `category`
  // must hold the CategoryID (as a string) for the form, not the name.
  return { ...menu, category: String(menu.categoryId) };
}

function buildMenuFormData(payload) {
  const formData = new FormData();
  formData.append("CategoryID", payload.category);
  formData.append("Name", payload.name);
  formData.append("Description", payload.description || "");
  formData.append("Price", payload.price);
  if (payload.imageFile) {
    formData.append("image", payload.imageFile);
  }
  return formData;
}

export async function createMenu(payload) {
  // NOTE: do NOT hardcode Content-Type to the string "multipart/form-data"
  // - that omits the required boundary and breaks multer's parsing on the
  // backend. Explicitly unsetting it (rather than leaving the instance's
  // default "application/json") lets axios generate the correct
  // multipart header (with boundary) for this FormData body.
  const { data } = await axiosInstance.post(MENU_ENDPOINTS.create, buildMenuFormData(payload), {
    headers: { "Content-Type": undefined },
  });
  return mapMenu(data.data);
}

export async function updateMenu(id, payload) {
  const { data } = await axiosInstance.put(MENU_ENDPOINTS.update(id), buildMenuFormData(payload), {
    headers: { "Content-Type": undefined },
  });
  return mapMenu(data.data);
}

export async function deleteMenu(id) {
  const { data } = await axiosInstance.delete(MENU_ENDPOINTS.delete(id));
  return data;
}

// NOTE: no bulk-delete endpoint exists on the backend (no
// POST /menus/bulk-delete route). Implemented as parallel individual
// DELETE requests against the existing DELETE /menus/:id endpoint.
// The backend also refuses to delete a menu still referenced by a
// reservation (409), so some ids in a bulk batch may legitimately fail.
export async function bulkDeleteMenus(ids) {
  const results = await Promise.allSettled(ids.map((id) => deleteMenu(id)));
  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length > 0) {
    throw new Error(
      `${failed.length} dari ${ids.length} menu gagal dihapus (kemungkinan masih dipakai di reservasi).`
    );
  }
  return true;
}
