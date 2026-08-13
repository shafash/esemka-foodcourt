import axiosInstance from "./axious";
import { AUTH_ENDPOINTS } from "../constants/api";
import { ROLE_ADMIN, ROLE_MEMBER } from "../constants/roles";

// Backend RoleID: 1 = Admin, 2 = Member (see server/prisma/seed.js + roleMiddleware usage)
function roleIdToRoleName(roleId) {
  return roleId === 1 ? ROLE_ADMIN : ROLE_MEMBER;
}

function mapUser(backendUser) {
  if (!backendUser) return null;
  return {
    id: backendUser.ID,
    firstName: backendUser.FirstName,
    lastName: backendUser.LastName,
    email: backendUser.Email,
    phone: backendUser.PhoneNumber,
    role: roleIdToRoleName(backendUser.RoleID),
    dateJoined: backendUser.DateJoined,
  };
}

export async function login(credentials) {
  const { data } = await axiosInstance.post(AUTH_ENDPOINTS.login, {
    Email: credentials.email,
    Password: credentials.password,
  });

  return {
    user: mapUser(data.data.user),
    token: data.data.token,
  };
}

export async function register(payload) {
  const { data } = await axiosInstance.post(AUTH_ENDPOINTS.register, {
    FirstName: payload.firstName,
    LastName: payload.lastName,
    Email: payload.email,
    PhoneNumber: payload.phone,
    Password: payload.password,
  });

  return { user: mapUser(data.data) };
}

export async function logout() {
  // The backend uses stateless JWT and has no /auth/logout endpoint.
  // Logging out is purely a client-side action (clearing the stored token).
  return true;
}

export async function getProfile() {
  const { data } = await axiosInstance.get(AUTH_ENDPOINTS.profile);
  return mapUser(data.user);
}
