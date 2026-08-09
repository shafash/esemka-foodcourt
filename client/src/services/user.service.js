import axiosInstance from "./axious";
import { ROLE_MEMBER } from "../constants/roles";

const MOCK_USER_ENABLED = true;

const USER_ENDPOINTS = {
  list: "/users",
  detail: (id) => `/users/${id}`,
  create: "/users",
  update: (id) => `/users/${id}`,
  delete: (id) => `/users/${id}`,
  bulkDelete: "/users/bulk-delete",
};

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateId() {
  return `mem-${Math.random().toString(36).slice(2, 9)}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

let MOCK_MEMBERS = [
  { id: "mem-001", firstName: "Milano", lastName: "Keshi", email: "milanokeshi@example.com", phone: "+6281762509237", memberSince: "2008-06-01", status: "active" },
  { id: "mem-002", firstName: "Sarah", lastName: "Jenkins", email: "sarah.j@example.com", phone: "+6281233445566", memberSince: "2012-08-15", status: "active" },
  { id: "mem-003", firstName: "Elena", lastName: "Rostova", email: "e.rostova@example.com", phone: "+6281199887766", memberSince: "2015-11-03", status: "inactive" },
  { id: "mem-004", firstName: "Marcus", lastName: "King", email: "m.king@example.com", phone: "+6282244556677", memberSince: "2019-02-22", status: "vip" },
  { id: "mem-005", firstName: "Citra", lastName: "Ayu", email: "citraayu@example.com", phone: "+6281762509241", memberSince: "2026-02-14", status: "active" },
  { id: "mem-006", firstName: "Dimas", lastName: "Prakoso", email: "dimasprakoso@example.com", phone: "+6281762509242", memberSince: "2026-02-25", status: "active" },
  { id: "mem-007", firstName: "Elang", lastName: "Nusantara", email: "elangnusantara@example.com", phone: "+6281762509243", memberSince: "2026-03-03", status: "inactive" },
];

function toSafeMember(member) {
  const safe = { ...member };
  delete safe.password;
  return safe;
}

async function mockGetMembers({ search = "", page = 1, pageSize = 8 } = {}) {
  await delay();

  const keyword = search.trim().toLowerCase();
  const filtered = MOCK_MEMBERS.filter((member) => {
    if (!keyword) return true;
    return (
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(keyword) ||
      member.email.toLowerCase().includes(keyword)
    );
  });

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize).map(toSafeMember);

  return { data, total };
}

async function mockGetMemberById(id) {
  await delay(300);
  const found = MOCK_MEMBERS.find((member) => member.id === id);
  if (!found) {
    throw new Error("Member tidak ditemukan.");
  }
  return toSafeMember(found);
}

async function mockCreateMember(payload) {
  await delay();
  const emailTaken = MOCK_MEMBERS.some(
    (member) => member.email.toLowerCase() === payload.email.trim().toLowerCase()
  );
  if (emailTaken) {
    throw new Error("Email sudah terdaftar sebagai member.");
  }
  const newMember = {
    id: generateId(),
    memberSince: today(),
    role: ROLE_MEMBER,
    status: "active",
    ...payload,
  };
  MOCK_MEMBERS = [newMember, ...MOCK_MEMBERS];
  return toSafeMember(newMember);
}

async function mockUpdateMember(id, payload) {
  await delay();
  let updated = null;
  MOCK_MEMBERS = MOCK_MEMBERS.map((member) => {
    if (member.id === id) {
      updated = { ...member, ...payload };
      return updated;
    }
    return member;
  });
  if (!updated) {
    throw new Error("Member tidak ditemukan.");
  }
  return toSafeMember(updated);
}

async function mockDeleteMember(id) {
  await delay(300);
  MOCK_MEMBERS = MOCK_MEMBERS.filter((member) => member.id !== id);
  return true;
}

async function mockBulkDeleteMembers(ids) {
  await delay(300);
  MOCK_MEMBERS = MOCK_MEMBERS.filter((member) => !ids.includes(member.id));
  return true;
}

export async function getMembers(params) {
  if (MOCK_USER_ENABLED) {
    return mockGetMembers(params);
  }
  const { data } = await axiosInstance.get(USER_ENDPOINTS.list, { params });
  return data;
}

export async function getMemberById(id) {
  if (MOCK_USER_ENABLED) {
    return mockGetMemberById(id);
  }
  const { data } = await axiosInstance.get(USER_ENDPOINTS.detail(id));
  return data;
}

export async function createMember(payload) {
  if (MOCK_USER_ENABLED) {
    return mockCreateMember(payload);
  }
  const { data } = await axiosInstance.post(USER_ENDPOINTS.create, payload);
  return data;
}

export async function updateMember(id, payload) {
  if (MOCK_USER_ENABLED) {
    return mockUpdateMember(id, payload);
  }
  const { data } = await axiosInstance.put(USER_ENDPOINTS.update(id), payload);
  return data;
}

export async function deleteMember(id) {
  if (MOCK_USER_ENABLED) {
    return mockDeleteMember(id);
  }
  const { data } = await axiosInstance.delete(USER_ENDPOINTS.delete(id));
  return data;
}

export async function bulkDeleteMembers(ids) {
  if (MOCK_USER_ENABLED) {
    return mockBulkDeleteMembers(ids);
  }
  const { data } = await axiosInstance.post(USER_ENDPOINTS.bulkDelete, { ids });
  return data;
}
