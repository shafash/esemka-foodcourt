function Loader({ size = "md", centered = false, label = "Memuat..." }) {
  const spinner = (
    <output
      className={`loader loader--${size}`}
      aria-label={label}
    />
  );

  if (centered) {
    return spinner;
  }

  return spinner;
}

export default Loader;