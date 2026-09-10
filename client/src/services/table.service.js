import axiosInstance from "./axios";
import { TABLE_ENDPOINTS } from "../constants/api";

function mapTable(t) {
  return {
    id: t.ID,
    name: t.Name,
  };
}

export async function getTablesPaginated({ search = "", page = 1, pageSize = 8 } = {}) {
  const { data } = await axiosInstance.get(TABLE_ENDPOINTS.list, {
    params: { page, limit: pageSize, search },
  });

  const tables = (data.data.tables || []).map(mapTable);
  return { data: tables, total: data.data.pagination?.totalData ?? tables.length };
}

export async function getTableById(id) {
  const { data } = await axiosInstance.get(TABLE_ENDPOINTS.detail(id));
  return mapTable(data.data);
}

export async function createTable(payload) {
  const { data } = await axiosInstance.post(TABLE_ENDPOINTS.list, { Name: payload.name });
  return mapTable(data.data);
}

export async function updateTable(id, payload) {
  const { data } = await axiosInstance.put(TABLE_ENDPOINTS.detail(id), { Name: payload.name });
  return mapTable(data.data);
}

export async function deleteTable(id) {
  const { data } = await axiosInstance.delete(TABLE_ENDPOINTS.detail(id));
  return data;
}