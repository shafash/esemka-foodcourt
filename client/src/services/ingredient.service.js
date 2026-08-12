import axiosInstance from "./axious";
import { unwrapApiData } from "./apiHelper";

const INGREDIENT_ENDPOINTS = {
  list: "/menuIngredients",
  create: "/menuIngredients",
  delete: (id) => `/menuIngredients/${id}`,
};

const UNIT_OPTIONS = ["g", "Kg", "ml", "l", "Pint", "Cup", "Gallon", "pcs"];
const ingredientCounts = {};

function normalizeIngredient(item) {
  return {
    id: item.ID ?? item.id,
    name: item.IngredientName ?? item.name ?? "",
    amount: Number(item.Qty ?? item.qty ?? item.amount ?? 0),
    unit: item.UnitName ?? item.unit ?? "g",
  };
}

export async function getIngredientsByMenu(menuId) {
  const { data } = await axiosInstance.get(INGREDIENT_ENDPOINTS.list, {
    params: { page: 1, limit: 100 },
  });

  const payload = unwrapApiData(data) ?? {};
  const ingredients = payload.menuIngredients || payload.data || [];
  const filtered = (ingredients || [])
    .filter((item) => String(item.MenuID ?? item.menuId) === String(menuId))
    .map(normalizeIngredient);

  ingredientCounts[menuId] = filtered.length;
  return filtered;
}

export async function saveIngredientsForMenu(menuId, ingredients) {
  const existing = await getIngredientsByMenu(menuId);

  await Promise.all(
    existing.map((item) => axiosInstance.delete(INGREDIENT_ENDPOINTS.delete(item.id)).catch(() => null))
  );

  const saved = [];
  for (const ingredient of ingredients) {
    try {
      const response = await axiosInstance.post(INGREDIENT_ENDPOINTS.create, {
        MenuID: Number(menuId),
        IngredientName: ingredient.name,
        UnitName: ingredient.unit,
        Qty: Number(ingredient.amount || 0),
      });
      saved.push(normalizeIngredient(unwrapApiData(response)));
    } catch (error) {
      if (error?.response?.status !== 409) {
        throw error;
      }
    }
  }

  ingredientCounts[menuId] = saved.length;
  return saved;
}

export function countIngredientsByMenu(menuId) {
  return ingredientCounts[menuId] || 0;
}

export const INGREDIENT_UNIT_OPTIONS = UNIT_OPTIONS.map((unit) => ({
  value: unit,
  label: unit,
}));
