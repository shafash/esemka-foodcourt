import axiosInstance from "./axious";
import { MENU_ENDPOINTS } from "../constants/api";

const MOCK_MENU_ENABLED = true;

export const MOCK_CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Beverage",
  "Dessert",
  "Snack",
];

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateId() {
  return `menu-${Math.random().toString(36).slice(2, 9)}`;
}

let MOCK_MENUS = [
  { id: "menu-001", name: "Zucchini Fritters", category: "Breakfast", price: 150000, description: "Served with a poached egg on top and a light herb salad.", imageUrl: null },
  { id: "menu-002", name: "Nasi Goreng Spesial", category: "Lunch", price: 35000, description: "Nasi goreng dengan telur, ayam suwir, dan acar segar.", imageUrl: null },
  { id: "menu-003", name: "Iced Matcha Latte", category: "Beverage", price: 28000, description: "Matcha premium dengan susu segar dan es batu.", imageUrl: null },
  { id: "menu-004", name: "Sate Ayam Madura", category: "Dinner", price: 32000, description: "Sate ayam bumbu kacang khas Madura, disajikan dengan lontong.", imageUrl: null },
  { id: "menu-005", name: "Pisang Goreng Keju", category: "Dessert", price: 18000, description: "Pisang goreng crispy dengan taburan keju parut dan cokelat.", imageUrl: null },
  { id: "menu-006", name: "Tahu Isi", category: "Snack", price: 12000, description: "Tahu goreng isi sayuran, disajikan dengan cabai rawit.", imageUrl: null },
  { id: "menu-007", name: "Roti Bakar Cokelat", category: "Breakfast", price: 20000, description: "Roti bakar dengan olesan cokelat dan taburan keju.", imageUrl: null },
  { id: "menu-008", name: "Soto Ayam Lamongan", category: "Lunch", price: 27000, description: "Soto ayam dengan kuah kuning segar dan koya gurih.", imageUrl: null },
  { id: "menu-009", name: "Es Teh Manis", category: "Beverage", price: 8000, description: "Teh manis dingin, segar untuk menemani makan siang.", imageUrl: null },
  { id: "menu-010", name: "Nasi Uduk Komplit", category: "Breakfast", price: 25000, description: "Nasi uduk dengan ayam goreng, tempe, dan sambal kacang.", imageUrl: null },
  { id: "menu-011", name: "Iga Bakar Madu", category: "Dinner", price: 65000, description: "Iga sapi bakar dengan saus madu manis gurih.", imageUrl: null },
  { id: "menu-012", name: "Puding Cokelat", category: "Dessert", price: 15000, description: "Puding cokelat lembut dengan saus vanila.", imageUrl: null },
  { id: "menu-013", name: "Pisang Nugget", category: "Snack", price: 14000, description: "Nugget pisang crispy dengan topping susu dan meses.", imageUrl: null },
  { id: "menu-014", name: "Bubur Ayam", category: "Breakfast", price: 17000, description: "Bubur ayam dengan cakwe, kerupuk, dan kecap manis.", imageUrl: null },
  { id: "menu-015", name: "Mie Ayam Bakso", category: "Lunch", price: 22000, description: "Mie ayam dengan bakso sapi dan pangsit goreng.", imageUrl: null },
  { id: "menu-016", name: "Jus Alpukat", category: "Beverage", price: 20000, description: "Jus alpukat kental dengan susu cokelat.", imageUrl: null },
  { id: "menu-017", name: "Ayam Bakar Taliwang", category: "Dinner", price: 38000, description: "Ayam bakar khas Lombok dengan sambal pedas.", imageUrl: null },
  { id: "menu-018", name: "Klepon", category: "Dessert", price: 10000, description: "Klepon isi gula merah dengan parutan kelapa segar.", imageUrl: null },
];

async function mockGetMenus({ search = "", category = "", page = 1, pageSize = 9 } = {}) {
  await delay();

  const filtered = MOCK_MENUS.filter((menu) => {
    const matchesSearch = menu.name.toLowerCase().includes(search.trim().toLowerCase());
    const matchesCategory = !category || menu.category === category;
    return matchesSearch && matchesCategory;
  });

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total };
}

async function mockGetMenuById(id) {
  await delay(300);
  const found = MOCK_MENUS.find((menu) => menu.id === id);
  if (!found) {
    throw new Error("Menu tidak ditemukan.");
  }
  return found;
}

async function mockCreateMenu(payload) {
  await delay();
  const newMenu = { id: generateId(), ...payload };
  MOCK_MENUS = [newMenu, ...MOCK_MENUS];
  return newMenu;
}

async function mockUpdateMenu(id, payload) {
  await delay();
  let updated = null;
  MOCK_MENUS = MOCK_MENUS.map((menu) => {
    if (menu.id === id) {
      updated = { ...menu, ...payload };
      return updated;
    }
    return menu;
  });
  if (!updated) {
    throw new Error("Menu tidak ditemukan.");
  }
  return updated;
}

async function mockDeleteMenu(id) {
  await delay(300);
  MOCK_MENUS = MOCK_MENUS.filter((menu) => menu.id !== id);
  return true;
}

async function mockBulkDeleteMenus(ids) {
  await delay(300);
  MOCK_MENUS = MOCK_MENUS.filter((menu) => !ids.includes(menu.id));
  return true;
}

export async function getMenus(params) {
  if (MOCK_MENU_ENABLED) {
    return mockGetMenus(params);
  }
  const { data } = await axiosInstance.get(MENU_ENDPOINTS.list, { params });
  return data;
}

export async function getMenuById(id) {
  if (MOCK_MENU_ENABLED) {
    return mockGetMenuById(id);
  }
  const { data } = await axiosInstance.get(MENU_ENDPOINTS.detail(id));
  return data;
}

export async function createMenu(payload) {
  if (MOCK_MENU_ENABLED) {
    return mockCreateMenu(payload);
  }
  const { data } = await axiosInstance.post(MENU_ENDPOINTS.create, payload);
  return data;
}

export async function updateMenu(id, payload) {
  if (MOCK_MENU_ENABLED) {
    return mockUpdateMenu(id, payload);
  }
  const { data } = await axiosInstance.put(MENU_ENDPOINTS.update(id), payload);
  return data;
}

export async function deleteMenu(id) {
  if (MOCK_MENU_ENABLED) {
    return mockDeleteMenu(id);
  }
  const { data } = await axiosInstance.delete(MENU_ENDPOINTS.delete(id));
  return data;
}

export async function bulkDeleteMenus(ids) {
  if (MOCK_MENU_ENABLED) {
    return mockBulkDeleteMenus(ids);
  }
  const { data } = await axiosInstance.post(MENU_ENDPOINTS.bulkDelete, { ids });
  return data;
}

export function countMenusByCategory(categoryName) {
  return MOCK_MENUS.filter((menu) => menu.category === categoryName).length;
}