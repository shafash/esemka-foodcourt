import axiosInstance from "./axious";

const MOCK_INGREDIENT_ENABLED = true;

const INGREDIENT_ENDPOINTS = {
  byMenu: (menuId) => `/menus/${menuId}/ingredients`,
  update: (menuId) => `/menus/${menuId}/ingredients`,
};

function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateId() {
  return `ing-${Math.random().toString(36).slice(2, 9)}`;
}

const UNIT_OPTIONS = ["g", "Kg", "ml", "l", "Pint", "Cup", "Gallon", "pcs"];

// Ingredients keyed by menu id, following the same in-memory mock pattern as
// menu.service.js / cetagory.service.js.
let MOCK_INGREDIENTS_BY_MENU = {
  "menu-001": [
    { id: "ing-001", name: "Zucchini", amount: 3, unit: "pcs" },
    { id: "ing-002", name: "Flour", amount: 59, unit: "Pint" },
    { id: "ing-003", name: "Egg", amount: 2, unit: "pcs" },
    { id: "ing-004", name: "Salt", amount: 5, unit: "g" },
    { id: "ing-005", name: "Olive Oil", amount: 30, unit: "ml" },
  ],
};

function ensureMenuBucket(menuId) {
  if (!MOCK_INGREDIENTS_BY_MENU[menuId]) {
    MOCK_INGREDIENTS_BY_MENU[menuId] = [];
  }
  return MOCK_INGREDIENTS_BY_MENU[menuId];
}

async function mockGetIngredientsByMenu(menuId) {
  await delay();
  return ensureMenuBucket(menuId).map((item) => ({ ...item }));
}

async function mockSaveIngredientsForMenu(menuId, ingredients) {
  await delay();
  const saved = ingredients.map((item) => ({
    id: item.id || generateId(),
    name: item.name,
    amount: Number(item.amount) || 0,
    unit: item.unit,
  }));
  MOCK_INGREDIENTS_BY_MENU[menuId] = saved;
  return saved;
}

export async function getIngredientsByMenu(menuId) {
  if (MOCK_INGREDIENT_ENABLED) {
    return mockGetIngredientsByMenu(menuId);
  }
  const { data } = await axiosInstance.get(INGREDIENT_ENDPOINTS.byMenu(menuId));
  return data;
}

export async function saveIngredientsForMenu(menuId, ingredients) {
  if (MOCK_INGREDIENT_ENABLED) {
    return mockSaveIngredientsForMenu(menuId, ingredients);
  }
  const { data } = await axiosInstance.put(INGREDIENT_ENDPOINTS.update(menuId), {
    ingredients,
  });
  return data;
}

export function countIngredientsByMenu(menuId) {
  return ensureMenuBucket(menuId).length;
}

export const INGREDIENT_UNIT_OPTIONS = UNIT_OPTIONS.map((unit) => ({
  value: unit,
  label: unit,
}));
