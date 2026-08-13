import axiosInstance from "./axious";
import { MENU_INGREDIENT_ENDPOINTS } from "../constants/api";

// NOTE ON DATA MODEL:
// The backend has no per-menu "ingredient" concept by itself. Ingredients
// are a global master list (GET/POST /ingredients), and the join between
// a Menu and an Ingredient (with its quantity + unit) lives in the
// MenuIngredients table, exposed at /menuIngredients. Each row there is
// its own entity with its own numeric ID, created/updated/deleted
// individually - there is no "replace the whole list for a menu" endpoint.
// The functions below preserve the existing IngredientDrawer UI contract
// (a flat array of {id, name, amount, unit} per menu) while translating
// saves into the individual create/update/delete calls the backend
// actually supports.

const UNIT_OPTIONS = ["g", "Kg", "ml", "l", "Pint", "Cup", "Gallon", "pcs"];

function mapRow(row) {
  return {
    id: row.ID,
    name: row.IngredientName,
    amount: Number(row.Qty),
    unit: row.UnitName,
  };
}

export async function getIngredientsByMenu(menuId) {
  const { data } = await axiosInstance.get(MENU_INGREDIENT_ENDPOINTS.list, {
    params: { menuId, limit: 100 },
  });
  return (data.data.menuIngredients || []).map(mapRow);
}

export async function saveIngredientsForMenu(menuId, ingredients) {
  const current = await getIngredientsByMenu(menuId);
  const currentIds = new Set(current.map((item) => item.id));
  const nextIds = new Set(
    ingredients.filter((item) => !String(item.id).startsWith("local-")).map((item) => item.id)
  );

  const toDelete = current.filter((item) => !nextIds.has(item.id));
  const toCreate = ingredients.filter((item) => String(item.id).startsWith("local-"));
  const toUpdate = ingredients.filter(
    (item) => !String(item.id).startsWith("local-") && currentIds.has(item.id)
  );

  await Promise.all([
    ...toDelete.map((item) =>
      axiosInstance.delete(MENU_INGREDIENT_ENDPOINTS.delete(item.id))
    ),
    ...toCreate.map((item) =>
      axiosInstance.post(MENU_INGREDIENT_ENDPOINTS.create, {
        MenuID: menuId,
        IngredientName: item.name,
        UnitName: item.unit,
        Qty: Number(item.amount) || 0,
      })
    ),
    ...toUpdate.map((item) =>
      axiosInstance.put(MENU_INGREDIENT_ENDPOINTS.update(item.id), {
        MenuID: menuId,
        IngredientName: item.name,
        UnitName: item.unit,
        Qty: Number(item.amount) || 0,
      })
    ),
  ]);

  return getIngredientsByMenu(menuId);
}

// Used by IngredientList.jsx to show "N ingredients configured" per menu,
// for the current page of visible menu rows. No dedicated backend
// aggregate/count-by-menu endpoint exists, so this fetches the full
// (unpaginated, up to 500 rows) menuIngredients list once and tallies
// counts client-side.
export async function getIngredientCountsByMenuIds(menuIds) {
  if (!menuIds || menuIds.length === 0) return {};
  const { data } = await axiosInstance.get(MENU_INGREDIENT_ENDPOINTS.list, {
    params: { limit: 500 },
  });
  const counts = {};
  for (const row of data.data.menuIngredients || []) {
    counts[row.MenuID] = (counts[row.MenuID] || 0) + 1;
  }
  return counts;
}

export const INGREDIENT_UNIT_OPTIONS = UNIT_OPTIONS.map((unit) => ({
  value: unit,
  label: unit,
}));
