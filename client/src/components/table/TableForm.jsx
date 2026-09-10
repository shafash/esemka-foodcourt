import { useForm } from "react-hook-form";

import Input from "../common/Input";
import Button from "../common/Button";

function TableForm({
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
        label="Table Name"
        placeholder="e.g. 01, 02, VIP-1"
        error={errors.name?.message}
        {...register("name", {
          required: "Nama meja wajib diisi.",
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

export default TableForm;