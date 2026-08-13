import axiosInstance from "./axious";
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

function mapStatus(status) {
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

// GAP: there is no backend endpoint that lets a MEMBER see which tables
// are currently reserved - GET /reservations is admin-only (role 1), and
// GET /reservations/me only returns the current user's own reservations.
// For an admin, we can cross-reference GET /reservations to mark tables
// as reserved/available. For a member, we fall back to showing every
// table as "available"; a genuine conflict is still caught server-side
// (createReservation responds 409 "Table is already reserved") and
// surfaced as a submit error. A real fix needs either a public
// GET /tables/availability endpoint or a role(1,2) reservations-by-date
// endpoint.
export async function getTables() {
  const { data: tablesRes } = await axiosInstance.get(TABLE_ENDPOINTS.list, {
    params: { limit: 100 },
  });
  const tables = tablesRes.data.tables || [];

  let activeReservations = [];
  try {
    const { data: resRes } = await axiosInstance.get(RESERVATION_ENDPOINTS.list, {
      params: { limit: 500 },
    });
    activeReservations = (resRes.data.reservations || []).filter((r) =>
      ACTIVE_STATUSES.includes(r.Status)
    );
  } catch {
    // 403 for member role - expected, see GAP note above.
    activeReservations = [];
  }

  return tables.map((table) => {
    const reservation = activeReservations.find((r) => r.Table.ID === table.ID);
    return {
      id: table.Name,
      tableDbId: table.ID,
      status: reservation ? "reserved" : "available",
      reservationId: reservation?.ID || null,
    };
  });
}

export async function getReservationById(id) {
  const { data } = await axiosInstance.get(RESERVATION_ENDPOINTS.detail(id));
  return mapReservationDetail(data.data);
}

// There is no "get reservation by table" endpoint on the backend. The
// admin Reservation page already knows the reservationId for a selected
// table from getTables() above, so this simply forwards to
// getReservationById using that id (or returns null if the table has no
// active reservation).
export async function getReservationByTable(table) {
  if (!table?.reservationId) return null;
  return getReservationById(table.reservationId);
}

export async function getMemberReservations() {
  const { data } = await axiosInstance.get(RESERVATION_ENDPOINTS.me, {
    params: { limit: 100 },
  });
  return (data.data.reservations || []).map(mapReservationSummary);
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

// Member-facing cancel (uses the member-scoped /reservations/me/:id/cancel
// endpoint, which also enforces the "only Pending can be cancelled" rule
// server-side).
export async function cancelMyReservation(id) {
  const { data } = await axiosInstance.put(RESERVATION_ENDPOINTS.meCancel(id));
  return mapReservationSummary(data.data);
}

// Admin-only status transition (Confirmed/Completed/Cancelled), used from
// the admin Reservation detail panel.
export async function updateReservationStatus(id, status) {
  const { data } = await axiosInstance.put(RESERVATION_ENDPOINTS.update(id), {
    Status: STATUS_MAP_REVERSE[status] || status,
  });
  return mapReservationSummary(data.data);
}

export async function confirmReservation(id) {
  return updateReservationStatus(id, "confirmed");
}

export const RESERVATION_FEE_AMOUNT = RESERVATION_FEE;
export const RESERVATION_TAX_RATE = TAX_RATE;
