export const RESERVATION_SESSIONS = [
  { value: "10:00", label: "10.00 - 12.00" },
  { value: "12:00", label: "12.00 - 14.00" },
  { value: "14:00", label: "14.00 - 16.00" },
  { value: "16:00", label: "16.00 - 18.00" },
  { value: "18:00", label: "18.00 - 20.00" },
  { value: "20:00", label: "20.00 - 22.00" },
];

export function getCurrentSessionTime(now = new Date()) {
  const hour = now.getHours();
  for (let i = RESERVATION_SESSIONS.length - 1; i >= 0; i -= 1) {
    const sessionStartHour = Number(RESERVATION_SESSIONS[i].value.split(":")[0]);
    if (hour >= sessionStartHour) {
      return RESERVATION_SESSIONS[i].value;
    }
  }
  return RESERVATION_SESSIONS[0].value;
}

export function getSessionLabel(time) {
  const session = RESERVATION_SESSIONS.find((item) => item.value === time);
  return session?.label || time;
}

export function getTodayDateString(now = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}