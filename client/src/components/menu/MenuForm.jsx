import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import ImageUploadField from "../common/ImageUploadField";
import { MOCK_CATEGORIES } from "../../services/menu.service";

function MenuForm({ initialValues, onSubmit, isSubmitting = false, submitLabel = "Save Change" }) {
  const navigate = useNavigate();

  const [image, setImage] = useState({
    file: null,
    previewUrl: initialValues?.imageUrl || null,
  });
  const [imageError, setImageError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: initialValues?.name || "",
      category: initialValues?.category || "",
      price: initialValues?.price ?? "",
      description: initialValues?.description || "",
    },
  });

  const categoryOptions = MOCK_CATEGORIES.map((category) => ({
    value: category,
    label: category,
  }));

  const handleImageChange = (file, previewUrl) => {
    setImage({ file, previewUrl });
    setImageError("");
  };

  const submitHandler = (values) => {
    if (!image.previewUrl) {
      setImageError("Gambar menu wajib diunggah.");
      return;
    }
    onSubmit({
      ...values,
      price: Number(values.price),
      imageUrl: image.previewUrl,
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit(submitHandler)} noValidate>
      <ImageUploadField
        value={image.previewUrl}
        onChange={handleImageChange}
        error={imageError}
        hint={!imageError ? "Format JPG/PNG, disarankan rasio 4:3" : undefined}
      />

      <Input
        label="Menu Name"
        placeholder="Menu name"
        error={errors.name?.message}
        {...register("name", { required: "Nama menu wajib diisi." })}
      />

      <div className="form-row">
        <Select
          label="Category"
          placeholder="Select category"
          options={categoryOptions}
          error={errors.category?.message}
          {...register("category", { required: "Kategori wajib dipilih." })}
        />

        <Input
          label="Price"
          type="number"
          min="0"
          placeholder="150000"
          error={errors.price?.message}
          {...register("price", {
            required: "Harga wajib diisi.",
            min: { value: 0, message: "Harga tidak boleh negatif." },
          })}
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="menu-description">
          Description
        </label>
        <textarea
          id="menu-description"
          className={`field__input field__textarea ${errors.description ? "field__input--error" : ""}`.trim()}
          placeholder="Describe the ingredients, preparation style, and allergens..."
          rows={4}
          {...register("description", { required: "Deskripsi wajib diisi." })}
        />
        {errors.description?.message && (
          <span className="field__error">{errors.description.message}</span>
        )}
      </div>

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={() => navigate("/menu")}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default MenuForm;