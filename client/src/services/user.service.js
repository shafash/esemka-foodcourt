import axiosInstance from "./axious";
import { ROLE_MEMBER } from "../constants/roles";
import { unwrapApiData } from "./apiHelper";

const USER_ENDPOINTS = {
  list: "/users",
  detail: (id) => `/users/${id}`,
  create: "/users",
  update: (id) => `/users/${id}`,
  delete: (id) => `/users/${id}`,
};

function normalizeMember(member) {
  if (!member) return null;

  return {
    id: member.ID ?? member.id,
    firstName: member.FirstName ?? member.firstName ?? "",
    lastName: member.LastName ?? member.lastName ?? "",
    email: member.Email ?? member.email ?? "",
    phone: member.PhoneNumber ?? member.phone ?? "",
    memberSince: member.DateJoined ?? member.memberSince ?? null,
    role: member.Role ?? member.role ?? ROLE_MEMBER,
    reservationCount: member.ReservationCount ?? member.reservationCount ?? 0,
  };
}

function normalizeMemberList(response) {
  const payload = unwrapApiData(response) ?? {};
  const members = (payload.members || payload.data || []).map(normalizeMember);
  return {
    data: members,
    total: payload.pagination?.totalData ?? members.length,
  };
}

export async function getMembers(params) {
  const { data } = await axiosInstance.get(USER_ENDPOINTS.list, {
    params: {
      page: params?.page ?? 1,
      limit: params?.pageSize ?? 10,
      search: params?.search ?? "",
    },
  });

  return normalizeMemberList(data);
}

export async function getMemberById(id) {
  const response = await axiosInstance.get(USER_ENDPOINTS.detail(id));
  return normalizeMember(unwrapApiData(response));
}

export async function createMember(payload) {
  const response = await axiosInstance.post(USER_ENDPOINTS.create, {
    FirstName: payload.firstName,
    LastName: payload.lastName,
    Email: payload.email,
    PhoneNumber: payload.phone,
    Password: payload.password,
  });
  return normalizeMember(unwrapApiData(response));
}

export async function updateMember(id, payload) {
  const response = await axiosInstance.put(USER_ENDPOINTS.update(id), {
    FirstName: payload.firstName,
    LastName: payload.lastName,
    Email: payload.email,
    PhoneNumber: payload.phone,
    Password: payload.password,
  });
  return normalizeMember(unwrapApiData(response));
}

export async function deleteMember(id) {
  await axiosInstance.delete(USER_ENDPOINTS.delete(id));
  return true;
}

export async function bulkDeleteMembers(ids) {
  if (!Array.isArray(ids) || ids.length === 0) {
    return true;
  }

  await Promise.all(ids.map((id) => axiosInstance.delete(USER_ENDPOINTS.delete(id))));
  return true;
}
