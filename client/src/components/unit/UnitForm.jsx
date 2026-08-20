import { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

function UnitForm({ initialValues, onSubmit, onCancel, isSubmitting, submitLabel = "Save" }) {
  const [name, setName] = useState(initialValues?.name || "");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) {
      setError("Nama unit tidak boleh kosong.");
      return;
    }

    setError("");
    onSubmit({ name: trimmed });
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="unit-name">Unit Name</label>
        <Input
          id="unit-name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Kg, Liter, Pcs"
          autoFocus
        />
        {error && <p className="auth-error">{error}</p>}
      </div>

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default UnitForm;