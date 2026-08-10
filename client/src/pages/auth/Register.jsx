import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  FiMail,
  FiLock,
  FiPhone,
  FiUser,
  FiArrowLeft,
} from "react-icons/fi";

import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";
import {
  isValidEmail,
  isValidPhone,
} from "../../utils/validators";

import "../../styles/auth.css";

function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setSubmitError("");
    setSubmitSuccess("");

    try {
      await registerUser(values);

      setSubmitSuccess(
        "Akun berhasil dibuat. Mengarahkan ke halaman login..."
      );

      setTimeout(
        () => navigate("/login", { replace: true }),
        1200
      );
    } catch (err) {
      setSubmitError(
        err.message || "Gagal membuat akun."
      );
    }
  };

  return (
    <Card className="auth-card auth-card--register">
      <div className="auth-register-header">
        <h1>Esemka Foodcourt</h1>
        <p>Create your management account</p>
      </div>

      {submitError && <p className="auth-error">{submitError}</p>}

      {submitSuccess && (
        <p className="auth-success">{submitSuccess}</p>
      )}

      <form
        className="form auth-register-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="form-row">
          <Input
            label="First Name"
            placeholder="e.g. Jane"
            iconLeft={<FiUser />}
            error={errors.firstName?.message}
            {...register("firstName", {
              required: "Nama depan wajib diisi.",
            })}
          />

          <Input
            label="Last Name"
            placeholder="e.g. Doe"
            iconLeft={<FiUser />}
            error={errors.lastName?.message}
            {...register("lastName", {
              required: "Nama belakang wajib diisi.",
            })}
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          iconLeft={<FiMail />}
          error={errors.email?.message}
          {...register("email", {
            required: "Email wajib diisi.",
            validate: (value) =>
              isValidEmail(value) || "Format email tidak valid.",
          })}
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+1 (0128) 000-00000"
          iconLeft={<FiPhone />}
          error={errors.phone?.message}
          {...register("phone", {
            required: "Nomor telepon wajib diisi.",
            validate: (value) =>
              isValidPhone(value) || "Format nomor telepon tidak valid.",
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="********"
          iconLeft={<FiLock />}
          togglePassword
          hint="Minimum 8 characters with at least one special symbol"
          error={errors.password?.message}
          {...register("password", {
            required: "Password wajib diisi.",
            minLength: {
              value: 8,
              message: "Password minimal 8 karakter.",
            },
            validate: (value) =>
              /[^A-Za-z0-9]/.test(value) ||
              "Password harus mengandung minimal satu simbol.",
          })}
        />

        <Button
          type="submit"
          variant="primary"
          className="button--cta"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Register"}
        </Button>
      </form>

      <div className="auth-footer auth-register-footer">
        <span>Already have an account?</span>
        <Link className="auth-footer-link" to="/login">
          <FiArrowLeft />
          <span>Back to login</span>
        </Link>
      </div>
    </Card>
  );
}

export default Register;
