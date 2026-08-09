function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MOCK_SUMMARY = {
  totalMembers: 1234,
  totalMembersCaption: "+12% from last month",
  activeMenus: 45,
  activeMenusCaption: "3 updated this week",
  todaysReservations: 12,
  todaysReservationsCaption: "4 pending confirmation",
  chartSeries: [
    { label: "Mon", value: 12 },
    { label: "Tue", value: 18 },
    { label: "Wed", value: 15 },
    { label: "Thu", value: 24 },
    { label: "Fri", value: 30 },
    { label: "Sat", value: 22 },
    { label: "Sun", value: 27 },
  ],
};

const MOCK_RECENT_RESERVATIONS = [
  {
    id: "RSV-00902",
    customer: "Milano Keshi",
    email: "milanokeshi@example.com",
    date: "Oct 24, 2026",
    time: "12:30 PM",
    status: "confirmed",
  },
  {
    id: "RSV-00901",
    customer: "Anasera",
    email: "anaseraaa@example.com",
    date: "Oct 24, 2026",
    time: "07:30 PM",
    status: "pending",
  },
  {
    id: "RSV-00900",
    customer: "Yemima Kala",
    email: "kalamimaa@example.com",
    date: "Oct 24, 2026",
    time: "01:15 PM",
    status: "confirmed",
  },
];

const MOCK_STOCK_ALERTS = [
  {
    id: "alert-1",
    title: "Coffee Beans Low",
    description: "Only 2kg remaining in storage.",
    severity: "danger",
  },
  {
    id: "alert-2",
    title: "Fresh Produce",
    description: "Check restock for Salad Bar.",
    severity: "warning",
  },
];

export async function getSummaryStats() {
  await delay();
  return MOCK_SUMMARY;
}

export async function getRecentReservations() {
  await delay();
  return MOCK_RECENT_RESERVATIONS;
}

export async function getStockAlerts() {
  await delay(350);
  return MOCK_STOCK_ALERTS;
}
