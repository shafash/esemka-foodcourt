import { useForm } from "react-hook-form";

import Input from "../common/Input";
import Button from "../common/Button";

function CategoryForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Save Change",
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: initialValues?.name || "",
    },
  });

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        label="Category Name"
        placeholder="e.g. Appetizer"
        error={errors.name?.message}
        {...register("name", {
          required: "Nama kategori wajib diisi.",
          minLength: { value: 2, message: "Nama kategori minimal 2 karakter." },
          maxLength: { value: 100, message: "Nama kategori maksimal 100 karakter." },
        })}
      />

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default CategoryForm;