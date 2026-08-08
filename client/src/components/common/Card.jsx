function Card({
  title,
  subtitle,
  headerAction,
  noPadding = false,
  className = "",
  children,
}) {
  const classes = ["card", noPadding ? "card--no-padding" : "", className]
    .filter(Boolean)
    .join(" ");

  const hasHeader = title || subtitle || headerAction;

  return (
    <div className={classes}>
      {hasHeader && (
        <div className="card__header">
          <div>
            {title && <h3 className="card__title">{title}</h3>}
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
          </div>
          {headerAction}
        </div>
      )}
      {children}
    </div>
  );
}

export default Card;
