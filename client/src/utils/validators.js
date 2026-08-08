const EMAIL_PATTERN = /^[\w.+-]+@[\w-]+(?:\.[\w-]+)+$/;
const PHONE_PATTERN = /^[0-9+()\s-]{8,15}$/;

export function isValidEmail(value = "") {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidPhone(value = "") {
  return PHONE_PATTERN.test(value.trim());
}

export function hasMinLength(value, min = 0) {
  return value.trim().length >= min;
}