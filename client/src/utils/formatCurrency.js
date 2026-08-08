export function formatCurrency(value, { locale = "id-ID", currency = "IDR" } = {}) {
  const numericValue = Number(value);
  if (value === null || value === undefined || Number.isNaN(numericValue)) {
    return "-";
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericValue);
}