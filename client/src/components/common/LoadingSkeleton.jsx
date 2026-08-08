function LoadingSkeleton({ variant = "text", count = 1 }) {
  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, index) => (
        <span
          key={index}
          className={`skeleton skeleton--${variant}`}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

export default LoadingSkeleton;