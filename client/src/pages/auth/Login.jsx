import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiUserPlus,
} from "react-icons/fi";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";
import { isValidEmail } from "../../utils/validators";
import logo from "../../assets/logo-esemka.png";

import "../../styles/auth.css";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const redirectTo =
    location.state?.from?.pathname || "/dashboard";

  const onSubmit = async (values) => {
    setSubmitError("");

    try {
      await login({
        email: values.email,
        password: values.password,
      });

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setSubmitError(
        err.message || "Email atau password salah."
      );
    }
  };

  return (
    <Card>
      <div className="auth-brand">
        <div className="auth-brand__logo">
          <img src={logo} alt="Esemka Foodcourt logo" />
        </div>

        <div className="auth-brand__content">
          <div className="auth-brand__title">
            Esemka Foodcourt
          </div>

          <div className="auth-brand__subtitle">
            Management System Access
          </div>
        </div>
      </div>

      {submitError && (
        <p className="auth-error">
          {submitError}
        </p>
      )}

      <form
        className="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          iconLeft={<FiMail />}
          error={errors.email?.message}
          {...register("email", {
            required: "Email wajib diisi.",
            validate: (value) =>
              isValidEmail(value) ||
              "Format email tidak valid.",
          })}
        />

        <Input
          label="Password"
          labelAction={
            <span className="field__label-action field__label-action--static">
              Forgot?
            </span>
          }
          type="password"
          placeholder="********"
          iconLeft={<FiLock />}
          togglePassword
          error={errors.password?.message}
          {...register("password", {
            required: "Password wajib diisi.",
          })}
        />

        <div className="auth-remember-row">
          <label className="auth-checkbox">
            <input
              type="checkbox"
              {...register("remember")}
            />

            <span>
              Remember this device for 30 days
            </span>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="button--cta"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
          <FiArrowRight />
        </Button>
      </form>

      <div className="auth-footer">
        <span>New here?</span>

        <Link
          to="/register"
          className="auth-footer-link"
        >
          <FiUserPlus />
          <span>Create an account</span>
        </Link>
      </div>
    </Card>
  );
}

export default Login;