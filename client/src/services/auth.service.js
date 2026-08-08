import axiosInstance from "./axious";
import { AUTH_ENDPOINTS } from "../constants/api";
import { ROLE_ADMIN, ROLE_MEMBER } from "../constants/roles";

const MOCK_AUTH_ENABLED = true;

const MOCK_USERS = [
  {
    id: "u-admin-1",
    firstName: "Admin",
    lastName: "Esemka",
    email: "admin@esemkafoodcourt.test",
    password: "admin1234",
    phone: "+628110000001",
    role: ROLE_ADMIN,
  },
  {
    id: "u-member-1",
    firstName: "Milano",
    lastName: "Keshi",
    email: "member@esemkafoodcourt.test",
    password: "member1234",
    phone: "+6281762509237",
    role: ROLE_MEMBER,
  },
];

function mockDelay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toSafeUser(user) {
  const safeUser = { ...user };
  delete safeUser.password;
  return safeUser;
}

async function mockLogin({ email, password }) {
  await mockDelay();
  const found = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  );
  if (!found) {
    throw new Error("Email atau password salah.");
  }
  return {
    user: toSafeUser(found),
    token: `mock-token-${found.id}-${Date.now()}`,
  };
}

async function mockRegister(payload) {
  await mockDelay();
  const emailTaken = MOCK_USERS.some(
    (u) => u.email.toLowerCase() === payload.email.trim().toLowerCase()
  );
  if (emailTaken) {
    throw new Error("Email sudah terdaftar.");
  }
  const newUser = {
    id: `u-member-${MOCK_USERS.length + 1}`,
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    password: payload.password,
    phone: payload.phone,
    role: ROLE_MEMBER,
  };
  MOCK_USERS.push(newUser);
  return { user: toSafeUser(newUser) };
}

export async function login(credentials) {
  if (MOCK_AUTH_ENABLED) {
    return mockLogin(credentials);
  }
  const { data } = await axiosInstance.post(AUTH_ENDPOINTS.login, credentials);
  return data;
}

export async function register(payload) {
  if (MOCK_AUTH_ENABLED) {
    return mockRegister(payload);
  }
  const { data } = await axiosInstance.post(AUTH_ENDPOINTS.register, payload);
  return data;
}

export async function logout() {
  if (MOCK_AUTH_ENABLED) {
    await mockDelay(150);
    return true;
  }
  const { data } = await axiosInstance.post(AUTH_ENDPOINTS.logout);
  return data;
}