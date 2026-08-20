import axiosInstance from "./axios";
import { UNIT_ENDPOINTS } from "../constants/api";

function mapUnit(u) {
  return { id: u.ID, name: u.Name };
}

export async function getUnits() {
  const { data } = await axiosInstance.get(UNIT_ENDPOINTS.list, {
    params: { page: 1, limit: 100 },
  });

  return (data.data.units || []).map((unit) => ({
    value: unit.Name,
    label: unit.Name,
  }));
}

export async function getUnitsPaginated({ search = "", page = 1, pageSize = 8 } = {}) {
  const { data } = await axiosInstance.get(UNIT_ENDPOINTS.list, {
    params: { page, limit: pageSize, search },
  });

  const units = (data.data.units || []).map(mapUnit);
  return { data: units, total: data.data.pagination?.totalData ?? units.length };
}

export async function getUnitById(id) {
  const { data } = await axiosInstance.get(UNIT_ENDPOINTS.detail(id));
  return mapUnit(data.data);
}

export async function createUnit(payload) {
  const { data } = await axiosInstance.post(UNIT_ENDPOINTS.create, { Name: payload.name });
  return mapUnit(data.data);
}

export async function updateUnit(id, payload) {
  const { data } = await axiosInstance.put(UNIT_ENDPOINTS.update(id), { Name: payload.name });
  return mapUnit(data.data);
}

export async function deleteUnit(id) {
  const { data } = await axiosInstance.delete(UNIT_ENDPOINTS.delete(id));
  return data;
}