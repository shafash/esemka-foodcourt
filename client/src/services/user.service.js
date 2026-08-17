import axiosInstance from "./axios";
import { USER_ENDPOINTS } from "../constants/api";
import { ROLE_MEMBER } from "../constants/roles";

function mapMember(m) {
  return {
    id: m.ID,
    firstName: m.FirstName,
    lastName: m.LastName,
    email: m.Email,
    phone: m.PhoneNumber,
    memberSince: m.DateJoined,
    role: ROLE_MEMBER,
    reservationCount: m.ReservationCount,
  };
}

export async function getMembers({ search = "", page = 1, pageSize = 8 } = {}) {
  const { data } = await axiosInstance.get(USER_ENDPOINTS.list, {
    params: { search, page, limit: pageSize },
  });
  return {
    data: (data.data.members || []).map(mapMember),
    total: data.data.pagination?.totalData ?? 0,
  };
}

export async function getMemberById(id) {
  const { data } = await axiosInstance.get(USER_ENDPOINTS.detail(id));
  return mapMember(data.data);
}

export async function createMember(payload) {
  const { data } = await axiosInstance.post(USER_ENDPOINTS.create, {
    FirstName: payload.firstName,
    LastName: payload.lastName,
    Email: payload.email,
    PhoneNumber: payload.phone,
    Password: payload.password,
  });
  return mapMember(data.data);
}

export async function updateMember(id, payload) {
  const body = {
    FirstName: payload.firstName,
    LastName: payload.lastName,
    Email: payload.email,
    PhoneNumber: payload.phone,
  };
  if (payload.password) body.Password = payload.password;

  const { data } = await axiosInstance.put(USER_ENDPOINTS.update(id), body);
  return mapMember(data.data);
}

export async function deleteMember(id) {
  const { data } = await axiosInstance.delete(USER_ENDPOINTS.delete(id));
  return data;
}

// NOTE: The backend does not provide a bulk-delete endpoint for members
// (no POST /users/bulk-delete route exists). Bulk delete is implemented
// here as parallel individual DELETE requests against the existing
// DELETE /users/:id endpoint. If a member has reservations, the backend
// will reject that individual deletion (409) while others still succeed.
export async function bulkDeleteMembers(ids) {
  const results = await Promise.allSettled(ids.map((id) => deleteMember(id)));
  const failed = results
    .map((r, i) => ({ r, id: ids[i] }))
    .filter(({ r }) => r.status === "rejected");

  if (failed.length > 0) {
    const error = new Error(
      `${failed.length} dari ${ids.length} member gagal dihapus (kemungkinan masih memiliki data reservasi).`
    );
    error.failedIds = failed.map((f) => f.id);
    throw error;
  }
  return true;
}
