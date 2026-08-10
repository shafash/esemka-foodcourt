import { forwardRef, useId, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Input = forwardRef(function Input(
  {
    label,
    labelAction,
    type = "text",
    iconLeft,
    error,
    hint,
    togglePassword = false,
    className = "",
    id,
    ...rest
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const generatedId = useId();
  const inputId = id || generatedId;

  const isPasswordField = type === "password";
  const resolvedType =
    isPasswordField && togglePassword && showPassword ? "text" : type;

  const inputClasses = [
    "field__input",
    iconLeft ? "field__input--has-icon-left" : "",
    isPasswordField && togglePassword
      ? "field__input--has-icon-right"
      : "",
    error ? "field__input--error" : "",
  ]
    .filter(Boolean)
    .join(" ");

  let message = null;

  if (error) {
    message = <span className="field__error">{error}</span>;
  } else if (hint) {
    message = <span className="field__hint">{hint}</span>;
  }

  return (
    <div className={`field ${className}`.trim()}>
      {(label || labelAction) && (
        <div className="field__label-row">
          {label && (
            <label className="field__label" htmlFor={inputId}>
              {label}
            </label>
          )}
          {labelAction}
        </div>
      )}

      <div className="field__control">
        {iconLeft && (
          <span className="field__icon-left">{iconLeft}</span>
        )}

        <input
          id={inputId}
          ref={ref}
          type={resolvedType}
          className={inputClasses}
          aria-invalid={Boolean(error)}
          {...rest}
        />

        {isPasswordField && togglePassword && (
          <button
            type="button"
            className="field__icon-right"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={
              showPassword
                ? "Sembunyikan password"
                : "Tampilkan password"
            }
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>

      {message}
    </div>
  );
});

export default Input;