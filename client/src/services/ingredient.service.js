import axiosInstance from "./axious.js";
import { MENU_INGREDIENT_ENDPOINTS } from "../constants/api.js";

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
    params: {
      menuId,
      limit: 100,
    },
  });

  return (data.data.menuIngredients || []).map(mapRow);
}

export async function saveIngredientsForMenu(menuId, ingredients) {
  const current = await getIngredientsByMenu(menuId);

  const currentIds = new Set(current.map((item) => Number(item.id)));

  const nextIds = new Set(
    ingredients
      .filter((item) => !String(item.id).startsWith("local-"))
      .map((item) => Number(item.id))
  );

  const toDelete = current.filter((item) => !nextIds.has(Number(item.id)));

  const toCreate = ingredients.filter((item) => String(item.id).startsWith("local-"));

  const toUpdate = ingredients.filter((item) => {
    if (String(item.id).startsWith("local-")) return false;
    const cur = current.find((c) => Number(c.id) === Number(item.id));
    if (!cur) return false;

    return (
      cur.amount !== Number(item.amount) ||
      cur.unit !== item.unit ||
      cur.name.trim() !== item.name.trim()
    );
  });

  if (toDelete.length > 0) {
    await Promise.all(
      toDelete.map((item) =>
        axiosInstance.delete(MENU_INGREDIENT_ENDPOINTS.delete(Number(item.id)))
      )
    );
  }

  if (toCreate.length > 0) {
    await Promise.all(
      toCreate.map((item) =>
        axiosInstance.post(MENU_INGREDIENT_ENDPOINTS.create, {
          MenuID: Number(menuId),
          IngredientName: item.name.trim(),
          UnitName: item.unit,
          Qty: Number(item.amount),
        })
      )
    );
  }

  if (toUpdate.length > 0) {
    await Promise.all(
      toUpdate.map((item) =>
        axiosInstance.put(MENU_INGREDIENT_ENDPOINTS.update(Number(item.id)), {
          MenuID: Number(menuId),
          IngredientName: item.name.trim(),
          UnitName: item.unit,
          Qty: Number(item.amount),
        })
      )
    );
  }

  return getIngredientsByMenu(menuId);
}

export async function getIngredientCountsByMenuIds(menuIds) {
  if (!menuIds || menuIds.length === 0) {
    return {};
  }

  const { data } = await axiosInstance.get(MENU_INGREDIENT_ENDPOINTS.list, {
    params: {
      limit: 500,
    },
  });

  const counts = {};

  for (const row of data.data.menuIngredients || []) {
    counts[row.MenuID] = (counts[row.MenuID] || 0) + 1;
  }

  return counts;
}