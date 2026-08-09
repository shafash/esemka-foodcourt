import { useCallback, useEffect, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

import Modal from "../common/Modal";
import Button from "../common/Button";
import Loader from "../common/Loader";
import useFetch from "../../hooks/useFetch";
import {
  getIngredientsByMenu,
  saveIngredientsForMenu,
  INGREDIENT_UNIT_OPTIONS,
} from "../../services/ingredient.service";

function IngredientDrawer({ menu, onClose, onSaved }) {
  const isOpen = Boolean(menu);

  const fetchIngredients = useCallback(
    () => (menu ? getIngredientsByMenu(menu.id) : Promise.resolve([])),
    [menu?.id]
  );
  const { data, isLoading } = useFetch(fetchIngredients);

  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    amount: "",
    unit: INGREDIENT_UNIT_OPTIONS[0]?.value || "g",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIngredients(data || []);
  }, [data]);

  useEffect(() => {
    if (menu) {
      setNewIngredient({ name: "", amount: "", unit: INGREDIENT_UNIT_OPTIONS[0]?.value || "g" });
      setError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu?.id]);

  const updateAmount = (id, amount) => {
    setIngredients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, amount } : item))
    );
  };

  const removeIngredient = (id) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  const addIngredient = () => {
    if (!newIngredient.name.trim()) return;
    setIngredients((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        name: newIngredient.name.trim(),
        amount: newIngredient.amount || 0,
        unit: newIngredient.unit,
      },
    ]);
    setNewIngredient({ name: "", amount: "", unit: newIngredient.unit });
  };

  const handleSave = async () => {
    setError("");
    setIsSaving(true);
    try {
      const saved = await saveIngredientsForMenu(menu.id, ingredients);
      onSaved?.(menu.id, saved.length);
      onClose();
    } catch (err) {
      setError(err.message || "Gagal menyimpan bahan baku.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="drawer">
      {menu && (
        <>
          <div className="ingredient-drawer__header">
            <p className="ingredient-drawer__eyebrow">Editing Ingredients</p>
            <h3 className="ingredient-drawer__title">{menu.name}</h3>
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
                  <div className="ingredient-row" key={item.id}>
                    <span className="ingredient-row__name">{item.name}</span>
                    <input
                      className="ingredient-row__amount"
                      type="number"
                      min="0"
                      value={item.amount}
                      onChange={(event) => updateAmount(item.id, event.target.value)}
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
                      setNewIngredient((prev) => ({ ...prev, name: event.target.value }))
                    }
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newIngredient.amount}
                    onChange={(event) =>
                      setNewIngredient((prev) => ({ ...prev, amount: event.target.value }))
                    }
                  />
                  <select
                    value={newIngredient.unit}
                    onChange={(event) =>
                      setNewIngredient((prev) => ({ ...prev, unit: event.target.value }))
                    }
                  >
                    {INGREDIENT_UNIT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="ingredient-add-row__submit"
                    onClick={addIngredient}
                    disabled={!newIngredient.name.trim()}
                    aria-label="Tambah bahan baku"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              {error && <p className="auth-error">{error}</p>}

              <div className="ingredient-drawer__footer">
                <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>
                  Cancel
                </Button>
                <Button type="button" variant="primary" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Change"}
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
