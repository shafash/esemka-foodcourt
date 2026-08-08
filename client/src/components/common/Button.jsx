function Button({
  variant = "primary",
  size = "md",
  icon,
  iconOnly = false,
  type = "button",
  disabled = false,
  onClick,
  className = "",
  children,
  ...rest
}) {
  const classes = [
    "button",
    `button--${variant}`,
    size === "sm" ? "button--sm" : "",
    iconOnly ? "button--icon" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {icon && <span className="button__icon">{icon}</span>}
      {!iconOnly && children}
    </button>
  );
}

export default Button;
