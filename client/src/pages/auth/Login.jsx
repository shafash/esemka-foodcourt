import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FiMail, FiLock, FiArrowRight, FiUserPlus } from "react-icons/fi";
import { GiKnifeFork } from "react-icons/gi";

import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";
import { isValidEmail } from "../../utils/validators";

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
    defaultValues: { email: "", password: "", remember: false },
  });

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const onSubmit = async (values) => {
    setSubmitError("");
    try {
      await login({ email: values.email, password: values.password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setSubmitError(err.message || "Email atau password salah.");
    }
  };

  return (
    <Card>
      <div className="auth-brand">
        <span className="auth-brand__logo">
          <GiKnifeFork />
        </span>
        <div>
          <p className="auth-brand__title">Esemka Foodcourt</p>
          <p className="auth-brand__subtitle">Management System Access</p>
        </div>
      </div>

      {submitError && <p className="auth-error">{submitError}</p>}

      <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          iconLeft={<FiMail />}
          error={errors.email?.message}
          {...register("email", {
            required: "Email wajib diisi.",
            validate: (value) => isValidEmail(value) || "Format email tidak valid.",
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="********"
          iconLeft={<FiLock />}
          togglePassword
          error={errors.password?.message}
          {...register("password", { required: "Password wajib diisi." })}
        />

        <div className="auth-remember-row">
            <label className="auth-checkbox">
                <input type="checkbox" {...register("remember")} />
                <span>Remember this device for 30 days</span>
            </label>

          <span className="auth-link auth-link--muted" title="Fitur belum tersedia">
            Forgot?
          </span>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="button--cta"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"} <FiArrowRight />
        </Button>
      </form>

      <div className="auth-divider">New here?</div>

      <Link to="/register">
        <Button type="button" variant="secondary" icon={<FiUserPlus />}>
          Create an account
        </Button>
      </Link>
    </Card>
  );
}

export default Login;