function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MOCK_SUMMARY = {
  totalReservations: 128,
  totalReservationsCaption: "+8% dari bulan lalu",
  totalMenus: 45,
  totalMenusCaption: "3 diperbarui minggu ini",
  totalCategories: 6,
  totalCategoriesCaption: "Semua kategori aktif",
  totalCustomers: 1234,
  totalCustomersCaption: "+12% dari bulan lalu",
  chartSeries: [
    { label: "Sen", value: 12 },
    { label: "Sel", value: 18 },
    { label: "Rab", value: 15 },
    { label: "Kam", value: 24 },
    { label: "Jum", value: 30 },
    { label: "Sab", value: 22 },
    { label: "Min", value: 27 },
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

const MOCK_STOCK_ALERTS = [];

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