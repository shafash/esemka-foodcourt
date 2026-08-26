import { useCallback, useEffect, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

import Modal from "../common/Modal";
import Button from "../common/Button";
import Loader from "../common/Loader";
import useFetch from "../../hooks/useFetch";
import {
  getIngredientsByMenu,
  saveIngredientsForMenu,
} from "../../services/ingredient.service";

import { getUnits } from "../../services/unit.service";

let newRowCounter = 0;

function IngredientDrawer({ menu, onClose, onSaved }) {
  const isOpen = Boolean(menu);

  const fetchIngredients = useCallback(
    () => (menu ? getIngredientsByMenu(menu.id) : Promise.resolve([])),
    [menu?.id]
  );

  const { data, isLoading } = useFetch(fetchIngredients);

  const { data: units = [], isLoading: isUnitsLoading } = useFetch(getUnits);

  const [ingredients, setIngredients] = useState([]);
  const [newRows, setNewRows] = useState([]);
  const [invalidRowIds, setInvalidRowIds] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIngredients(data || []);
  }, [data]);

  useEffect(() => {
    if (menu) {
      setNewRows([]);
      setInvalidRowIds({});
      setError("");
    }
  }, [menu?.id]);

  const clearInvalid = (id) => {
    setInvalidRowIds((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const updateAmount = (id, amount) => {
    setIngredients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, amount } : item))
    );
    clearInvalid(id);
  };

  const removeIngredient = (id) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
    clearInvalid(id);
  };

  const addNewRow = () => {
    const id = `local-${Date.now()}-${newRowCounter++}`;

    setNewRows((prev) => [
      ...prev,
      { id, name: "", amount: "", unit: units[0]?.value || "" },
    ]);
  };

  const updateNewRow = (id, field, value) => {
    setNewRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
    clearInvalid(id);
  };

  const removeNewRow = (id) => {
    setNewRows((prev) => prev.filter((row) => row.id !== id));
    clearInvalid(id);
  };

  const handleSave = async () => {
    setError("");

    const nextInvalid = {};

    ingredients.forEach((item) => {
      if (!item.amount || Number(item.amount) <= 0) {
        nextInvalid[item.id] = true;
      }
    });

    const defaultUnit = units[0]?.value || "";
    const touchedNewRows = newRows.filter(
      (row) => row.name.trim() || row.amount || row.unit !== defaultUnit
    );

    touchedNewRows.forEach((row) => {
      if (!row.name.trim() || !row.amount || Number(row.amount) <= 0 || !row.unit) {
        nextInvalid[row.id] = true;
      }
    });

    if (Object.keys(nextInvalid).length > 0) {
      setInvalidRowIds(nextInvalid);
      setError("Lengkapi bahan baku yang ditandai sebelum menyimpan.");
      return;
    }

    setIsSaving(true);

    try {
      const payload = [
        ...ingredients,
        ...touchedNewRows.map((row) => ({
          id: row.id,
          name: row.name.trim(),
          amount: Number(row.amount),
          unit: row.unit,
        })),
      ];

      const saved = await saveIngredientsForMenu(menu.id, payload);

      onSaved?.(menu.id, saved.length);
      onClose();
    } catch (err) {
      console.error("SAVE INGREDIENT ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Gagal menyimpan bahan baku."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const totalItems = ingredients.length + newRows.length;
  const showNewDivider = ingredients.length > 0 && newRows.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="drawer"
      title={
        menu && (
          <span className="ingredient-drawer__header-content">
            <span className="ingredient-drawer__eyebrow">Editing Ingredients</span>
            <span className="ingredient-drawer__title">{menu.name}</span>
          </span>
        )
      }
      footer={
        menu &&
        !isLoading && (
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Change"}
            </Button>
          </>
        )
      }
    >
      {menu &&
        (isLoading ? (
          <Loader label="Memuat bahan baku..." />
        ) : (
          <>
            <div className="ingredient-drawer__section-title">
              <span>Current Ingredients</span>
              <span>{totalItems} Items</span>
            </div>

            <div>
              {ingredients.map((item) => (
                <div className="ingredient-row" key={item.id}>
                  <span className="ingredient-row__name">{item.name}</span>

                  <input
                    className={`ingredient-row__amount${
                      invalidRowIds[item.id]
                        ? " ingredient-row__amount--invalid"
                        : ""
                    }`}
                    type="number"
                    min="0"
                    value={item.amount}
                    onChange={(event) =>
                      updateAmount(item.id, event.target.value)
                    }
                  />

                  <span className="ingredient-row__unit">{item.unit}</span>

                  <button
                    type="button"
                    className="ingredient-row__remove"
                    onClick={() => removeIngredient(item.id)}
                    aria-label={`Hapus ${item.name}`}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}

              {showNewDivider && (
                <div className="ingredient-drawer__divider">
                  <span>New</span>
                </div>
              )}

              {newRows.map((row) => (
                <div className="ingredient-row ingredient-row--new" key={row.id}>
                  <input
                    className={`ingredient-row__name-input${
                      invalidRowIds[row.id] && !row.name.trim()
                        ? " ingredient-row__name-input--invalid"
                        : ""
                    }`}
                    type="text"
                    placeholder="Ingredient name"
                    value={row.name}
                    onChange={(event) =>
                      updateNewRow(row.id, "name", event.target.value)
                    }
                  />

                  <input
                    className={`ingredient-row__amount${
                      invalidRowIds[row.id] &&
                      (!row.amount || Number(row.amount) <= 0)
                        ? " ingredient-row__amount--invalid"
                        : ""
                    }`}
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0"
                    value={row.amount}
                    onKeyDown={(event) => {
                      if (event.key === "e" || event.key === "E") {
                        event.preventDefault();
                      }
                    }}
                    onChange={(event) =>
                      updateNewRow(row.id, "amount", event.target.value)
                    }
                  />

                  <select
                    value={row.unit}
                    onChange={(event) =>
                      updateNewRow(row.id, "unit", event.target.value)
                    }
                    disabled={isUnitsLoading || units.length === 0}
                  >
                    {isUnitsLoading ? (
                      <option value="">Loading units...</option>
                    ) : units.length === 0 ? (
                      <option value="">No units available</option>
                    ) : (
                      units.map((unit) => (
                        <option key={unit.value} value={unit.value}>
                          {unit.label}
                        </option>
                      ))
                    )}
                  </select>

                  <button
                    type="button"
                    className="ingredient-row__remove"
                    onClick={() => removeNewRow(row.id)}
                    aria-label="Hapus baris baru"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="ingredient-drawer__add-trigger"
              onClick={addNewRow}
              disabled={isUnitsLoading}
            >
              <FiPlus />
              Add new ingredient
            </button>

            {error && <p className="auth-error">{error}</p>}
          </>
        ))}
    </Modal>
  );
}

export default IngredientDrawer;