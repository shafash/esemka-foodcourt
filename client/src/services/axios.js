import axios from "axios";
import { API_BASE_URL } from "../constants/api";
import { getCookieValue } from "../utils/cookies";
import { CSRF_COOKIE_NAME } from "../constants/auth";

const MUTATING_METHODS = ["post", "put", "patch", "delete"];

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const method = (config.method || "").toLowerCase();

  if (MUTATING_METHODS.includes(method)) {
    const csrfToken = getCookieValue(CSRF_COOKIE_NAME);

    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const backendMessage = error.response?.data?.message;
    const validationErrors = error.response?.data?.errors;

    if (backendMessage) {
      const normalized = new Error(
        validationErrors?.length
          ? `${backendMessage}: ${validationErrors
              .map((e) => `${e.field} - ${e.message}`)
              .join(", ")}`
          : backendMessage
      );

      normalized.status = error.response.status;
      normalized.original = error;

      return Promise.reject(normalized);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;