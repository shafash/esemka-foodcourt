import axiosInstance from "./axious";
import { AUTH_ENDPOINTS } from "../constants/api";
import { ROLE_ADMIN, ROLE_MEMBER } from "../constants/roles";
import { unwrapApiData } from "./apiHelper";

function normalizeUser(user) {
  if (!user) return null;

  const roleId = user.RoleID ?? user.roleId ?? null;
  let role = user.role || user.Role || null;

  if (!role && roleId === 1) {
    role = ROLE_ADMIN;
  } else if (!role && roleId === 2) {
    role = ROLE_MEMBER;
  }

  return {
    id: user.ID ?? user.id ?? null,
    firstName: user.FirstName ?? user.firstName ?? "",
    lastName: user.LastName ?? user.lastName ?? "",
    email: user.Email ?? user.email ?? "",
    phone: user.PhoneNumber ?? user.phone ?? "",
    role,
    roleId,
  };
}

export async function login(credentials) {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.login, {
    Email: credentials.email,
    Password: credentials.password,
  });

  const payload = unwrapApiData(response);
  return {
    token: payload?.token ?? null,
    user: normalizeUser(payload?.user ?? payload),
  };
}

export async function register(payload) {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.register, {
    FirstName: payload.firstName,
    LastName: payload.lastName,
    Email: payload.email,
    PhoneNumber: payload.phone,
    Password: payload.password,
  });

  const payloadData = unwrapApiData(response);
  return {
    user: normalizeUser(payloadData?.user ?? payloadData),
  };
}

export async function logout() {
  try {
    await axiosInstance.post(AUTH_ENDPOINTS.logout);
  } catch (error) {
    if (error?.response?.status !== 404) {
      throw error;
    }
  }

  return true;
}