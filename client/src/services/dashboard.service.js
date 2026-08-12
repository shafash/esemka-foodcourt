import axiosInstance from "./axious";
import { unwrapApiData } from "./apiHelper";

export async function getSummaryStats() {
  const [membersResponse, menusResponse, reservationsResponse] = await Promise.all([
    axiosInstance.get("/users", { params: { limit: 1 } }),
    axiosInstance.get("/menus", { params: { limit: 1 } }),
    axiosInstance.get("/reservations", { params: { limit: 1 } }),
  ]);

  const membersPayload = unwrapApiData(membersResponse) ?? {};
  const menusPayload = unwrapApiData(menusResponse) ?? {};
  const reservationsPayload = unwrapApiData(reservationsResponse) ?? {};

  const totalMembers = membersPayload.pagination?.totalData ?? 0;
  const activeMenus = menusPayload.pagination?.totalData ?? 0;
  const todaysReservations = (reservationsPayload.reservations || reservationsPayload.data || []).length;

  return {
    totalMembers,
    totalMembersCaption: `${totalMembers} registered members`,
    activeMenus,
    activeMenusCaption: `${activeMenus} menus available`,
    todaysReservations,
    todaysReservationsCaption: `${todaysReservations} reservations tracked`,
  };
}

export async function getRecentReservations() {
  const response = await axiosInstance.get("/reservations");
  const payload = unwrapApiData(response) ?? {};
  const reservations = payload.reservations || payload.data || [];
  return (reservations || []).slice(0, 5).map((item) => ({
    id: item.ID ?? item.id,
    customer: `${item.CustomerFirstName ?? ""} ${item.CustomerLastName ?? ""}`.trim(),
    email: item.CustomerEmail ?? item.email ?? "",
    date: item.ReservationDate ?? item.date,
    time: item.ReservationTime ?? item.time,
    status: String(item.Status ?? item.status ?? "Pending").toLowerCase(),
  }));
}

export async function getStockAlerts() {
  return [];
}
