import axiosInstance from "./axious";
import { MENU_ENDPOINTS, API_BASE_URL } from "../constants/api";

const SERVER_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

function buildImageUrl(filename) {
  if (!filename) return null;

  if (
    typeof filename === "string" &&
    (filename.startsWith("http://") || filename.startsWith("https://"))
  ) {
    return filename;
  }

  return `${SERVER_ORIGIN}/uploads/menus/${filename}`;
}

function getCategoryName(category) {
  if (!category) return "";

  if (typeof category === "object") {
    return category.Name ?? category.name ?? "";
  }

  return String(category);
}

function getCategoryId(menu) {
  return (
    menu.CategoryID ??
    menu.categoryId ??
    (typeof menu.Category === "object"
      ? menu.Category?.ID ?? menu.Category?.id
      : null)
  );
}

function mapMenu(m) {
  const categoryId = getCategoryId(m);

  return {
    id: m.ID ?? m.id,
    name: m.Name ?? m.name ?? "",
    category: getCategoryName(m.Category ?? m.category),
    categoryId,
    price: Number(m.Price ?? m.price ?? 0),
    description: m.Description ?? m.description ?? "",
    imageUrl: buildImageUrl(m.Image ?? m.image),
  };
}

export async function getMenus({
  search = "",
  category = "",
  page = 1,
  pageSize = 9,
} = {}) {
  const { data } = await axiosInstance.get(MENU_ENDPOINTS.list, {
    params: {
      search,
      page,
      limit: pageSize,
    },
  });

  const rawMenus = data?.data?.menus ?? [];

  let items = rawMenus.map(mapMenu);

  if (category) {
    items = items.filter(
      (menu) => String(menu.categoryId) === String(category)
    );
  }

  return {
    data: items,
    total: data?.data?.pagination?.totalData ?? items.length,
  };
}

export async function getMenuById(id) {
  const { data } = await axiosInstance.get(
    MENU_ENDPOINTS.detail(id)
  );

  return mapMenu(data.data);
}

function buildMenuFormData(payload) {
  const formData = new FormData();

  formData.append(
    "CategoryID",
    String(payload.categoryId ?? payload.category ?? "")
  );

  formData.append("Name", payload.name ?? "");
  formData.append("Description", payload.description ?? "");
  formData.append("Price", String(payload.price ?? ""));

  if (payload.imageFile) {
    formData.append("image", payload.imageFile);
  }

  return formData;
}

export async function createMenu(payload) {
  const { data } = await axiosInstance.post(
    MENU_ENDPOINTS.create,
    buildMenuFormData(payload)
  );

  return mapMenu(data.data);
}

export async function updateMenu(id, payload) {
  const { data } = await axiosInstance.put(
    MENU_ENDPOINTS.update(id),
    buildMenuFormData(payload)
  );

  return mapMenu(data.data);
}

export async function deleteMenu(id) {
  const { data } = await axiosInstance.delete(
    MENU_ENDPOINTS.delete(id)
  );

  return data;
}

export async function bulkDeleteMenus(ids) {
  const results = await Promise.allSettled(
    ids.map((id) => deleteMenu(id))
  );

  const failed = results.filter(
    (result) => result.status === "rejected"
  );

  if (failed.length > 0) {
    throw new Error(
      `${failed.length} dari ${ids.length} menu gagal dihapus (kemungkinan masih dipakai di reservasi).`
    );
  }

  return true;
}