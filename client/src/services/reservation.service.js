import axiosInstance from "./axios";
import { RESERVATION_ENDPOINTS, TABLE_ENDPOINTS } from "../constants/api";

const RESERVATION_FEE = 50000;
const TAX_RATE = 0.1;

const STATUS_MAP = {
  Pending: "pending",
  Confirmed: "confirmed",
  Completed: "completed",
  Cancelled: "canceled",
};
const STATUS_MAP_REVERSE = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  canceled: "Cancelled",
};
const ACTIVE_STATUSES = ["Pending", "Confirmed"];

export function mapStatus(status) {
  return STATUS_MAP[status] || status?.toLowerCase();
}

function mapDetailItems(details) {
  return (details || []).map((d) => ({
    menuId: d.MenuID,
    name: d.MenuName,
    price: Number(d.Price),
    qty: d.Quantity,
  }));
}

function computeTotals(items) {
  const menuTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Math.round(menuTotal * TAX_RATE);
  return { menuTotal, tax, total: menuTotal + tax + RESERVATION_FEE };
}

function mapReservationSummary(r) {
  const items = mapDetailItems(r.ReservationDetails);

  return {
    id: r.ID,
    tableId: r.Table?.Name,
    firstName: r.CustomerFirstName,
    lastName: r.CustomerLastName,
    email: r.CustomerEmail,
    phone: r.CustomerPhoneNumber,
    date: r.ReservationDate,
    time: r.ReservationTime,
    guests: r.NumberOfPeople,
    status: mapStatus(r.Status),
    createdAt: r.CreatedAt,

    items,

    ...computeTotals(items),
  };
}

function mapReservationDetail(r) {
  const items = mapDetailItems(r.ReservationDetails);
  return {
    id: r.ID,
    tableId: r.Table?.Name,
    firstName: r.CustomerFirstName || r.User?.FullName?.split(" ")[0],
    lastName: r.CustomerLastName,
    email: r.CustomerEmail || r.User?.Email,
    phone: r.CustomerPhoneNumber,
    date: r.ReservationDate,
    time: r.ReservationTime,
    guests: r.NumberOfPeople,
    status: mapStatus(r.Status),
    items,
    ...computeTotals(items),
  };
}

export async function getTables(date = "", time = "") {
  const params = {
    limit: 100,
  };

  if (date) {
    params.date = date;
  }

  if (time) {
    params.time = time;
  }

  const { data: tablesRes } = await axiosInstance.get(
    TABLE_ENDPOINTS.list,
    {
      params,
    }
  );

  const tables = tablesRes?.data?.tables || [];

  return tables.map((table) => ({
    id: table.Name,
    tableDbId: table.ID,
    status:
      table.status === "reserved"
        ? "reserved"
        : "available",
    reservationId:
      table.reservationId || null,
  }));
}

export async function getAdminReservations({ page = 1, limit = 10 } = {}) {
  const { data } = await axiosInstance.get(RESERVATION_ENDPOINTS.list, {
    params: { page, limit },
  });

  return {
    data: (data.data.reservations || []).map(mapReservationSummary),
    pagination: data.data.pagination || {
      page,
      limit,
      totalData: 0,
      totalPages: 0,
    },
  };
}

export async function getAllReservationsForReport() {
  const limit = 100;
  const first = await getAdminReservations({ page: 1, limit });

  const all = [...first.data];
  const totalPages = first.pagination.totalPages || 1;

  for (let page = 2; page <= totalPages; page += 1) {
    const next = await getAdminReservations({ page, limit });
    all.push(...next.data);
  }

  return all;
}

export async function getReservationById(id) {
  const { data } = await axiosInstance.get(RESERVATION_ENDPOINTS.detail(id));
  return mapReservationDetail(data.data);
}

export async function getReservationByTable(table) {
  if (!table?.reservationId) return null;
  return getReservationById(table.reservationId);
}

export async function getMemberReservations({ page = 1, limit = 10, status = "" } = {}) {
  const params = { page, limit };

  if (status && status !== "all") {
    params.status = STATUS_MAP_REVERSE[status] || status;
  }

  const { data } = await axiosInstance.get(RESERVATION_ENDPOINTS.me, {
    params,
  });

  return {
    data: (data.data.reservations || []).map(mapReservationSummary),
    pagination: data.data.pagination || {
      page,
      limit,
      totalData: 0,
      totalPages: 0,
    },
  };
}

export async function getMyReservationById(id) {
  const { data } = await axiosInstance.get(RESERVATION_ENDPOINTS.meDetail(id));
  return mapReservationDetail(data.data);
}

export async function createReservation(payload) {
  const { data } = await axiosInstance.post(RESERVATION_ENDPOINTS.create, {
    UseAccountData: Boolean(payload.useAccountData),
    CustomerFirstName: payload.firstName,
    CustomerLastName: payload.lastName,
    CustomerEmail: payload.email,
    CustomerPhoneNumber: payload.phone,
    ReservationDate: payload.date,
    ReservationTime: payload.time,
    NumberOfPeople: payload.guests,
    TableID: payload.tableDbId,
    Items: (payload.items || []).map((item) => ({
      MenuID: item.menuId,
      Quantity: item.qty,
    })),
  });
  return data.data;
}

export async function cancelReservation(id) {
  return updateReservationStatus(id, "canceled");
}

export async function cancelMyReservation(id) {
  const { data } = await axiosInstance.put(RESERVATION_ENDPOINTS.meCancel(id));
  return mapReservationSummary(data.data);
}

export async function updateReservationStatus(id, status) {
  const { data } = await axiosInstance.put(RESERVATION_ENDPOINTS.update(id), {
    Status: STATUS_MAP_REVERSE[status] || status,
  });
  return mapReservationSummary(data.data);
}

export async function confirmReservation(id) {
  return updateReservationStatus(id, "confirmed");
}

export async function completeReservation(id) {
  return updateReservationStatus(id, "completed");
}

export const RESERVATION_FEE_AMOUNT = RESERVATION_FEE;
export const RESERVATION_TAX_RATE = TAX_RATE;