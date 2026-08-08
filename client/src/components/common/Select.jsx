import { forwardRef, useId } from "react";

const Select = forwardRef(function Select(
  { label, options = [], placeholder, error, hint, className = "", id, ...rest },
  ref
) {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className={`field ${className}`.trim()}>
      {label && (
        <label className="field__label" htmlFor={selectId}>
          {label}
        </label>
      )}

      <div className="field__control">
        <select
          id={selectId}
          ref={ref}
          className={`field__input field__select ${error ? "field__input--error" : ""}`.trim()}
          aria-invalid={Boolean(error)}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <span className="field__error">{error}</span>
      ) : hint ? (
        <span className="field__hint">{hint}</span>
      ) : null}
    </div>
  );
});

export default Select;