import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FiUser, FiUserPlus, FiMail, FiLock, FiPhone } from "react-icons/fi";

import Input from "../common/Input";
import Button from "../common/Button";
import { isValidPhone } from "../../utils/validators";

function MemberForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save Change",
  isEdit = false,
}) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: initialValues?.firstName || "",
      lastName: initialValues?.lastName || "",
      email: initialValues?.email || "",
      password: "",
      phone: initialValues?.phone || "",
    },
  });

  return (
    <div className="card member-form-card">
      <div className="member-form-card__header">
        <div>
          <h3 className="member-form-card__title">Member Identity</h3>
          <p className="member-form-card__subtitle">
            {isEdit
              ? "Update the personal details for this member account"
              : "Enter the personal details for the new member account"}
          </p>
        </div>
        <span className="member-form-card__avatar">
          {isEdit ? <FiUser size={20} /> : <FiUserPlus size={20} />}
        </span>
      </div>

      <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-row">
          <Input
            label="First Name"
            placeholder="e.g. Jane"
            iconLeft={<FiUser />}
            error={errors.firstName?.message}
            {...register("firstName", { required: "Nama depan wajib diisi." })}
          />
          <Input
            label="Last Name"
            placeholder="e.g. Doe"
            iconLeft={<FiUser />}
            error={errors.lastName?.message}
            {...register("lastName", { required: "Nama belakang wajib diisi." })}
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="jane.doe@example.com"
          iconLeft={<FiMail />}
          error={errors.email?.message}
          {...register("email", {
            required: "Email wajib diisi.",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Format email tidak valid." },
          })}
        />

        <Input
          label="Account Password"
          type="password"
          togglePassword
          iconLeft={<FiLock />}
          placeholder={isEdit ? "Leave blank to keep current password" : "********"}
          hint={!errors.password ? "Minimum 8 characters with at least one special symbol" : undefined}
          error={errors.password?.message}
          {...register("password", {
            required: isEdit ? false : "Password wajib diisi.",
            validate: (value) =>
              !value || value.length >= 8 || "Password minimal 8 karakter.",
          })}
        />

        <Input
          label="Phone Number"
          placeholder="+1 (555) 000-0000"
          iconLeft={<FiPhone />}
          error={errors.phone?.message}
          {...register("phone", {
            required: "Nomor telepon wajib diisi.",
            validate: (value) =>
              isValidPhone(value) || "Nomor telepon minimal 8 digit dan maksimal 15 digit.",
          })}
        />

        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={() => navigate("/members")}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitLabel} <span aria-hidden>→</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

export default MemberForm;
