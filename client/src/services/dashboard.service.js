import axiosInstance from "./axious";
import { USER_ENDPOINTS, MENU_ENDPOINTS, RESERVATION_ENDPOINTS } from "../constants/api";

// GAP: there is no dedicated dashboard/summary endpoint on the backend
// (no GET /dashboard route exists anywhere in server/src/routes). The
// stats below are composed client-side from the existing admin-only
// endpoints (GET /users, GET /menus, GET /reservations). This means:
//  - "+12% from last month" / "3 updated this week" style captions have
//    no historical data to compute from, so they are omitted rather than
//    invented.
//  - "Stock Alerts" cannot be implemented at all: the Ingredients model
//    in prisma/schema.prisma has no stock/quantity/threshold field
//    whatsoever (Ingredients is just {ID, Name}). This would need a real
//    schema change (e.g. a Stock/StockLevel table) plus a backend
//    endpoint before this card can show real data.
//  - "Performance Reports" (Download Report) has no backend endpoint to
//    generate or fetch a report from.

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export async function getSummaryStats() {
  const [membersRes, menusRes, reservationsRes] = await Promise.all([
    axiosInstance.get(USER_ENDPOINTS.list, { params: { limit: 1 } }),
    axiosInstance.get(MENU_ENDPOINTS.list, { params: { limit: 1 } }),
    axiosInstance.get(RESERVATION_ENDPOINTS.list, { params: { limit: 200 } }),
  ]);

  const today = todayStr();
  const reservations = reservationsRes.data.data.reservations || [];
  const todaysReservations = reservations.filter(
    (r) => new Date(r.ReservationDate).toISOString().slice(0, 10) === today
  );
  const pendingToday = todaysReservations.filter((r) => r.Status === "Pending").length;

  return {
    totalMembers: membersRes.data.data.pagination?.totalData ?? 0,
    totalMembersCaption: null,
    activeMenus: menusRes.data.data.pagination?.totalData ?? 0,
    activeMenusCaption: null,
    todaysReservations: todaysReservations.length,
    todaysReservationsCaption:
      pendingToday > 0 ? `${pendingToday} pending confirmation` : null,
  };
}

export async function getRecentReservations() {
  const { data } = await axiosInstance.get(RESERVATION_ENDPOINTS.list, {
    params: { limit: 3 },
  });
  return (data.data.reservations || []).map((r) => ({
    id: r.ID,
    customer: `${r.CustomerFirstName} ${r.CustomerLastName}`,
    email: r.CustomerEmail,
    date: new Date(r.ReservationDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: r.ReservationTime,
    status: r.Status?.toLowerCase(),
  }));
}

// GAP: see note above - no backend data source for ingredient stock
// exists, so this always returns an empty list rather than fake data.
export async function getStockAlerts() {
  return [];
}
