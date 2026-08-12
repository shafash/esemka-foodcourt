import axiosInstance from "./axious";
import { unwrapApiData } from "./apiHelper";

const RESERVATION_ENDPOINTS = {
  tables: "/tables",
  list: "/reservations",
  detail: (id) => `/reservations/${id}`,
  create: "/reservations",
  update: (id) => `/reservations/${id}`,
  cancel: (id) => `/reservations/me/${id}/cancel`,
  confirm: (id) => `/reservations/${id}`,
  byMember: (memberId) => `/reservations/me`,
};

const RESERVATION_FEE = 50000;
const TAX_RATE = 0.1;

function computeTotals(items = []) {
  const menuTotal = (items || []).reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0);
  const tax = Math.round(menuTotal * TAX_RATE);
  return {
    menuTotal,
    tax,
    total: menuTotal + tax + RESERVATION_FEE,
  };
}

function normalizeTable(table) {
  return {
    id: table.ID ?? table.id,
    name: table.Name ?? table.name,
    status: table.status ?? "available",
    reservationId: table.ReservationID ?? table.reservationId ?? null,
  };
}

function normalizeReservation(reservation) {
  if (!reservation) return null;

  const details = (reservation.ReservationDetails || reservation.items || []).map((item) => ({
    menuId: item.MenuID ?? item.menuId ?? item.ID,
    name: item.MenuName ?? item.name ?? item.Menu?.Name,
    price: Number(item.Price ?? item.price ?? 0),
    qty: Number(item.Quantity ?? item.qty ?? 0),
  }));

  const totals = computeTotals(details);

  return {
    id: reservation.ID ?? reservation.id,
    tableId: reservation.Table?.ID ?? reservation.TableID ?? reservation.tableId,
    status: String(reservation.Status ?? reservation.status ?? "Pending").toLowerCase(),
    firstName: reservation.CustomerFirstName ?? reservation.firstName ?? "",
    lastName: reservation.CustomerLastName ?? reservation.lastName ?? "",
    email: reservation.CustomerEmail ?? reservation.email ?? "",
    phone: reservation.CustomerPhoneNumber ?? reservation.phone ?? "",
    date: reservation.ReservationDate ?? reservation.date,
    time: reservation.ReservationTime ?? reservation.time,
    guests: reservation.NumberOfPeople ?? reservation.guests,
    items: details,
    ...totals,
  };
}

export async function getTables() {
  const response = await axiosInstance.get(RESERVATION_ENDPOINTS.tables);
  const payload = unwrapApiData(response) ?? {};
  const tables = payload.tables || payload.data || [];
  return (tables || []).map(normalizeTable);
}

export async function getReservationByTable(tableId) {
  const response = await axiosInstance.get(RESERVATION_ENDPOINTS.list, { params: { tableId } });
  const payload = unwrapApiData(response) ?? {};
  const reservations = payload.reservations || payload.data || [];
  return normalizeReservation((reservations || [])[0] || null);
}

export async function getReservationById(id) {
  const response = await axiosInstance.get(RESERVATION_ENDPOINTS.detail(id));
  return normalizeReservation(unwrapApiData(response));
}

export async function getMemberReservations(memberId) {
  const response = await axiosInstance.get(RESERVATION_ENDPOINTS.byMember(memberId));
  const payload = unwrapApiData(response) ?? {};
  const reservations = payload.reservations || payload.data || [];
  return (reservations || []).map(normalizeReservation);
}

export async function createReservation(payload) {
  const response = await axiosInstance.post(RESERVATION_ENDPOINTS.create, {
    UseAccountData: Boolean(payload.memberId),
    CustomerFirstName: payload.firstName,
    CustomerLastName: payload.lastName,
    CustomerEmail: payload.email,
    CustomerPhoneNumber: payload.phone,
    ReservationDate: payload.date,
    ReservationTime: payload.time,
    NumberOfPeople: Number(payload.guests),
    TableID: Number(payload.tableId),
    Items: (payload.items || []).map((item) => ({
      MenuID: Number(item.menuId),
      Quantity: Number(item.qty),
    })),
  });
  return normalizeReservation(unwrapApiData(response));
}

export async function cancelReservation(id) {
  const response = await axiosInstance.put(RESERVATION_ENDPOINTS.cancel(id));
  return normalizeReservation(unwrapApiData(response));
}

export async function confirmReservation(id) {
  const response = await axiosInstance.put(RESERVATION_ENDPOINTS.confirm(id), { Status: "Confirmed" });
  return normalizeReservation(unwrapApiData(response));
}

export const RESERVATION_FEE_AMOUNT = RESERVATION_FEE;
export const RESERVATION_TAX_RATE = TAX_RATE;
