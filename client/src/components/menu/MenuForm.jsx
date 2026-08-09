import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import ImageUploadField from "../common/ImageUploadField";
import useFetch from "../../hooks/useFetch";
import { getCategoryOptions } from "../../services/cetagory.service";

const DIETARY_TAG_OPTIONS = ["Vegetarian", "Vegan", "Gluten-Free", "Spicy"];

function MenuForm({ initialValues, onSubmit, isSubmitting = false, submitLabel = "Save Change" }) {
  const navigate = useNavigate();

  const { data: categoryOptions, isLoading: isCategoriesLoading } =
    useFetch(getCategoryOptions);

  const [image, setImage] = useState({
    file: null,
    previewUrl: initialValues?.imageUrl || null,
  });
  const [imageError, setImageError] = useState("");
  const [dietaryTags, setDietaryTags] = useState(initialValues?.dietaryTags || []);

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

  const handleImageChange = (file, previewUrl) => {
    setImage({ file, previewUrl });
    setImageError("");
  };

  const toggleDietaryTag = (tag) => {
    setDietaryTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
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
      dietaryTags,
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
          placeholder={
            isCategoriesLoading
              ? "Loading categories..."
              : "Select category"
          }
          options={categoryOptions || []}
          disabled={isCategoriesLoading}
          error={errors.category?.message}
          {...register("category", {
            required: "Kategori wajib dipilih.",
          })}
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
          placeholder="Describe the dish, ingredients, and flavor profile..."
          rows={4}
          {...register("description", { required: "Deskripsi wajib diisi." })}
        />
        {errors.description?.message && (
          <span className="field__error">{errors.description.message}</span>
        )}
      </div>

      <div className="dietary-tags">
        <p className="dietary-tags__label">Dietary Tags</p>
        <div className="dietary-tags__options">
          {DIETARY_TAG_OPTIONS.map((tag) => (
            <label className="dietary-tags__option" key={tag}>
              <input
                type="checkbox"
                checked={dietaryTags.includes(tag)}
                onChange={() => toggleDietaryTag(tag)}
              />
              {tag}
            </label>
          ))}
        </div>
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