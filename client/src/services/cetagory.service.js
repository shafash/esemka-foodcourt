import axiosInstance from "./axious";
import { CATEGORY_ENDPOINTS } from "../constants/api";
import { countMenusByCategory } from "./menu.service";

const MOCK_CATEGORY_ENABLED = true;

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateId() {
  return `cat-${Math.random().toString(36).slice(2, 9)}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

let MOCK_CATEGORIES_DATA = [
  { id: "cat-001", name: "Breakfast", description: "Menu untuk sarapan pagi, disajikan hingga jam 11.", createdAt: "2026-01-10" },
  { id: "cat-002", name: "Lunch", description: "Menu utama untuk makan siang.", createdAt: "2026-01-10" },
  { id: "cat-003", name: "Dinner", description: "Menu utama untuk makan malam.", createdAt: "2026-01-12" },
  { id: "cat-004", name: "Beverage", description: "Minuman dingin & panas.", createdAt: "2026-01-15" },
  { id: "cat-005", name: "Dessert", description: "Menu penutup manis.", createdAt: "2026-01-18" },
  { id: "cat-006", name: "Snack", description: "Camilan ringan.", createdAt: "2026-02-01" },
  { id: "cat-007", name: "Kids Meal", description: "Menu porsi kecil untuk anak-anak.", createdAt: "2026-02-10" },
];

function withMenuCount(category) {
  return { ...category, menuCount: countMenusByCategory(category.name) };
}

async function mockGetCategories({ search = "", page = 1, pageSize = 8 } = {}) {
  await delay();

  const filtered = MOCK_CATEGORIES_DATA.filter((category) =>
    category.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize).map(withMenuCount);

  return { data, total };
}

async function mockGetCategoryById(id) {
  await delay(300);
  const found = MOCK_CATEGORIES_DATA.find((category) => category.id === id);
  if (!found) {
    throw new Error("Kategori tidak ditemukan.");
  }
  return withMenuCount(found);
}

async function mockCreateCategory(payload) {
  await delay();
  const nameTaken = MOCK_CATEGORIES_DATA.some(
    (category) => category.name.toLowerCase() === payload.name.trim().toLowerCase()
  );
  if (nameTaken) {
    throw new Error("Nama kategori sudah digunakan.");
  }
  const newCategory = { id: generateId(), createdAt: today(), ...payload };
  MOCK_CATEGORIES_DATA = [newCategory, ...MOCK_CATEGORIES_DATA];
  return withMenuCount(newCategory);
}

async function mockUpdateCategory(id, payload) {
  await delay();
  let updated = null;
  MOCK_CATEGORIES_DATA = MOCK_CATEGORIES_DATA.map((category) => {
    if (category.id === id) {
      updated = { ...category, ...payload };
      return updated;
    }
    return category;
  });
  if (!updated) {
    throw new Error("Kategori tidak ditemukan.");
  }
  return withMenuCount(updated);
}

async function mockDeleteCategory(id) {
  await delay(300);
  const target = MOCK_CATEGORIES_DATA.find((category) => category.id === id);
  if (!target) {
    throw new Error("Kategori tidak ditemukan.");
  }
  if (countMenusByCategory(target.name) > 0) {
    throw new Error(
      "Kategori tidak dapat dihapus karena masih dipakai oleh menu aktif. Pindahkan atau hapus menu terkait terlebih dahulu."
    );
  }
  MOCK_CATEGORIES_DATA = MOCK_CATEGORIES_DATA.filter((category) => category.id !== id);
  return true;
}

async function mockGetCategoryOptions() {
  await delay(200);
  return MOCK_CATEGORIES_DATA.map((category) => ({ value: category.name, label: category.name }));
}

export async function getCategories(params) {
  if (MOCK_CATEGORY_ENABLED) {
    return mockGetCategories(params);
  }
  const { data } = await axiosInstance.get(CATEGORY_ENDPOINTS.list, { params });
  return data;
}

export async function getCategoryById(id) {
  if (MOCK_CATEGORY_ENABLED) {
    return mockGetCategoryById(id);
  }
  const { data } = await axiosInstance.get(CATEGORY_ENDPOINTS.detail(id));
  return data;
}

export async function createCategory(payload) {
  if (MOCK_CATEGORY_ENABLED) {
    return mockCreateCategory(payload);
  }
  const { data } = await axiosInstance.post(CATEGORY_ENDPOINTS.create, payload);
  return data;
}

export async function updateCategory(id, payload) {
  if (MOCK_CATEGORY_ENABLED) {
    return mockUpdateCategory(id, payload);
  }
  const { data } = await axiosInstance.put(CATEGORY_ENDPOINTS.update(id), payload);
  return data;
}

export async function deleteCategory(id) {
  if (MOCK_CATEGORY_ENABLED) {
    return mockDeleteCategory(id);
  }
  const { data } = await axiosInstance.delete(CATEGORY_ENDPOINTS.delete(id));
  return data;
}

export async function getCategoryOptions() {
  if (MOCK_CATEGORY_ENABLED) {
    return mockGetCategoryOptions();
  }
  const { data } = await axiosInstance.get(CATEGORY_ENDPOINTS.list, {
    params: { pageSize: 100 },
  });
  return (data?.data || []).map((category) => ({ value: category.name, label: category.name }));
}