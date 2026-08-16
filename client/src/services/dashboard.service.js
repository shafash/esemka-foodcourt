import axiosInstance from "./axious";
import { USER_ENDPOINTS, MENU_ENDPOINTS, RESERVATION_ENDPOINTS } from "../constants/api";
import { mapStatus } from "./reservation.service";

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
    // Reuses the pagination metadata from the same reservations request
    // above (no extra network call) so the dashboard can decide whether
    // enough reservations exist to enable the report download.
    totalReservations: reservationsRes.data.data.pagination?.totalData ?? 0,
  };
}

export async function getRecentReservations() {
  const { data } = await axiosInstance.get(RESERVATION_ENDPOINTS.list, {
    params: { limit: 5 },
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
    status: mapStatus(r.Status),
  }));
}