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

function parseQuantity(value) {
  const input = String(value).trim();

  if (!input) return Number.NaN;

  if (input.includes(" ")) {
    const [wholePart, fractionPart] = input.split(/\s+/);

    const whole = Number(wholePart);
    const [numerator, denominator] = fractionPart.split("/").map(Number);

    if (
      !Number.isFinite(whole) ||
      !Number.isFinite(numerator) ||
      !Number.isFinite(denominator) ||
      denominator === 0
    ) {
      return Number.NaN;
    }

    return whole + numerator / denominator;
  }

  if (input.includes("/")) {
    const [numerator, denominator] = input.split("/").map(Number);

    if (
      !Number.isFinite(numerator) ||
      !Number.isFinite(denominator) ||
      denominator === 0
    ) {
      return Number.NaN;
    }

    return numerator / denominator;
  }
  return Number(input);
}

function IngredientDrawer({ menu, onClose, onSaved }) {
  const isOpen = Boolean(menu);

  const fetchIngredients = useCallback(
    () => (menu ? getIngredientsByMenu(menu.id) : Promise.resolve([])),
    [menu?.id]
  );

  const { data, isLoading } = useFetch(fetchIngredients);

  const {
    data: units = [],
    isLoading: isUnitsLoading,
  } = useFetch(getUnits);

  const [ingredients, setIngredients] = useState([]);

  const [newIngredient, setNewIngredient] = useState({
    name: "",
    amount: "",
    unit: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIngredients(data || []);
  }, [data]);

  useEffect(() => {
    if (menu) {
      setNewIngredient({
        name: "",
        amount: "",
        unit: units[0]?.value || "",
      });

      setError("");
    }
  }, [menu?.id, units]);

  const updateAmount = (id, amount) => {
    setIngredients((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              amount,
            }
          : item
      )
    );
  };

  const removeIngredient = (id) => {
    setIngredients((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const addIngredient = () => {
    const name = newIngredient.name.trim();
    const amount = Number(newIngredient.amount);

    if (!name) {
      setError("Nama ingredient wajib diisi.");
      return;
    }

    if (!newIngredient.unit) {
      setError("Unit wajib dipilih.");
      return;
    }

    if (!newIngredient.amount || amount <= 0) {
      setError("Quantity harus lebih besar dari 0.");
      return;
    }

    setIngredients((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        name,
        amount,
        unit: newIngredient.unit,
      },
    ]);

    setNewIngredient({
      name: "",
      amount: "",
      unit: newIngredient.unit,
    });

    setError("");
  };

  const handleSave = async () => {
    setError("");

    // Validasi sebelum request ke backend
    const invalidIngredient = ingredients.find(
      (item) => !item.amount || Number(item.amount) <= 0
    );

    if (invalidIngredient) {
      setError(
        `Quantity untuk "${invalidIngredient.name}" harus lebih besar dari 0.`
      );
      return;
    }

    const invalidUnit = ingredients.find(
      (item) => !item.unit
    );

    if (invalidUnit) {
      setError(
        `Unit untuk "${invalidUnit.name}" belum dipilih.`
      );
      return;
    }

    setIsSaving(true);

    try {
      const saved = await saveIngredientsForMenu(
        menu.id,
        ingredients
      );

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="drawer"
    >
      {menu && (
        <>
          <div className="ingredient-drawer__header">
            <p className="ingredient-drawer__eyebrow">
              Editing Ingredients
            </p>

            <h3 className="ingredient-drawer__title">
              {menu.name}
            </h3>
          </div>

          {isLoading ? (
            <Loader label="Memuat bahan baku..." />
          ) : (
            <>
              <div className="ingredient-drawer__section-title">
                <span>Current Ingredients</span>
                <span>{ingredients.length} Items</span>
              </div>

              <div>
                {ingredients.map((item) => (
                  <div
                    className="ingredient-row"
                    key={item.id}
                  >
                    <span className="ingredient-row__name">
                      {item.name}
                    </span>

                    <input
                      className="ingredient-row__amount"
                      type="number"
                      min="0"
                      value={item.amount}
                      onChange={(event) =>
                        updateAmount(
                          item.id,
                          event.target.value
                        )
                      }
                    />

                    <span className="ingredient-row__unit">
                      {item.unit}
                    </span>

                    <button
                      type="button"
                      className="ingredient-row__remove"
                      onClick={() =>
                        removeIngredient(item.id)
                      }
                      aria-label={`Hapus ${item.name}`}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>

              <div className="ingredient-drawer__add">
                <div className="ingredient-drawer__section-title">
                  <span>Add New Ingredient</span>
                </div>

                <div className="ingredient-add-row">
                  <input
                    type="text"
                    placeholder="add new ingredient"
                    value={newIngredient.name}
                    onChange={(event) =>
                      setNewIngredient((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                  />

                  <input
                    type="decimal"
                    min="0"
                    placeholder="0"
                    value={newIngredient.amount}
                    onChange={(event) =>
                      setNewIngredient((prev) => ({
                        ...prev,
                        amount: event.target.value,
                      }))
                    }
                  />

                  <select
                    value={newIngredient.unit}
                    onChange={(event) =>
                      setNewIngredient((prev) => ({
                        ...prev,
                        unit: event.target.value,
                      }))
                    }
                    disabled={
                      isUnitsLoading || units.length === 0
                    }
                  >
                    {isUnitsLoading ? (
                      <option value="">
                        Loading units...
                      </option>
                    ) : units.length === 0 ? (
                      <option value="">
                        No units available
                      </option>
                    ) : (
                      units.map((unit) => (
                        <option
                          key={unit.value}
                          value={unit.value}
                        >
                          {unit.label}
                        </option>
                      ))
                    )}
                  </select>

                  <button
                    type="button"
                    className="ingredient-add-row__submit"
                    onClick={addIngredient}
                    disabled={
                      !newIngredient.name.trim() ||
                      !newIngredient.amount ||
                      Number(newIngredient.amount) <= 0 ||
                      !newIngredient.unit ||
                      isUnitsLoading
                    }
                    aria-label="Tambah bahan baku"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              {error && (
                <p className="auth-error">
                  {error}
                </p>
              )}

              <div className="ingredient-drawer__footer">
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
                  {isSaving
                    ? "Saving..."
                    : "Save Change"}
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </Modal>
  );
}

export default IngredientDrawer;