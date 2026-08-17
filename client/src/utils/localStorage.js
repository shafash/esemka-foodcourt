export const AUTH_USER_KEY = "esemka_auth_user";

export function getStorageItem(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn(`Gagal membaca localStorage key "${key}"`, error);
    return null;
  }
}

export function setStorageItem(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Gagal menulis localStorage key "${key}"`, error);
  }
}

export function removeStorageItem(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Gagal menghapus localStorage key "${key}"`, error);
  }
}