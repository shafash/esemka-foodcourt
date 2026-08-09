import axiosInstance from "./axious";

const MOCK_RESERVATION_ENABLED = true;

const RESERVATION_ENDPOINTS = {
  tables: "/reservations/tables",
  list: "/reservations",
  detail: (id) => `/reservations/${id}`,
  create: "/reservations",
  update: (id) => `/reservations/${id}`,
  cancel: (id) => `/reservations/${id}/cancel`,
  confirm: (id) => `/reservations/${id}/confirm`,
  byMember: (memberId) => `/reservations/member/${memberId}`,
};

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateReservationId() {
  const next = 900 + MOCK_RESERVATIONS.length + 1;
  return `RSV-${String(next).padStart(5, "0")}`;
}

const TABLE_IDS = Array.from({ length: 16 }, (_, index) => `T-${String(index + 1).padStart(2, "0")}`);

const RESERVATION_FEE = 50000;
const TAX_RATE = 0.1;

let MOCK_RESERVATIONS = [
  {
    id: "RSV-00902",
    tableId: "T-06",
    memberId: "mem-001",
    firstName: "Milano",
    lastName: "Keshi",
    email: "milanokeshi@example.com",
    phone: "+6281762509237",
    date: "2026-10-24",
    time: "12:30 PM",
    guests: 4,
    items: [
      { menuId: "menu-001", name: "Zucchini fritters", price: 150000, qty: 2 },
      { menuId: "menu-001", name: "Zucchini fritters", price: 150000, qty: 2 },
      { menuId: "menu-001", name: "Zucchini fritters", price: 150000, qty: 2 },
    ],
    status: "confirmed",
    createdAt: "2026-10-20",
  },
  {
    id: "RSV-00901",
    tableId: "T-09",
    memberId: "mem-002",
    firstName: "Anasera",
    lastName: "Putri",
    email: "anaseraaa@example.com",
    phone: "+6281762509238",
    date: "2026-10-24",
    time: "07:30 PM",
    guests: 2,
    items: [{ menuId: "menu-002", name: "Nasi Goreng Spesial", price: 35000, qty: 2 }],
    status: "pending",
    createdAt: "2026-10-21",
  },
  {
    id: "RSV-00900",
    tableId: "T-15",
    memberId: "mem-003",
    firstName: "Yemima",
    lastName: "Kala",
    email: "kalamimaa@example.com",
    phone: "+6281762509239",
    date: "2026-10-12",
    time: "11:30 AM",
    guests: 2,
    items: [{ menuId: "menu-004", name: "Sate Ayam Madura", price: 32000, qty: 2 }],
    status: "completed",
    createdAt: "2026-10-10",
  },
  {
    id: "RSV-00810",
    tableId: "T-01",
    memberId: "mem-001",
    firstName: "Milano",
    lastName: "Keshi",
    email: "milanokeshi@example.com",
    phone: "+6281762509237",
    date: "2026-01-12",
    time: "11:30 AM",
    guests: 2,
    items: [{ menuId: "menu-006", name: "Tahu Isi", price: 12000, qty: 2 }],
    status: "canceled",
    createdAt: "2026-01-05",
  },
];

function computeTotals(items) {
  const menuTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Math.round(menuTotal * TAX_RATE);
  return {
    menuTotal,
    tax,
    total: menuTotal + tax + RESERVATION_FEE,
  };
}

function activeStatusesForTable() {
  return ["pending", "confirmed"];
}

function withTotals(reservation) {
  return { ...reservation, ...computeTotals(reservation.items) };
}

async function mockGetTables() {
  await delay(300);
  return TABLE_IDS.map((tableId) => {
    const reservation = MOCK_RESERVATIONS.find(
      (item) => item.tableId === tableId && activeStatusesForTable().includes(item.status)
    );
    return {
      id: tableId,
      status: reservation ? "reserved" : "available",
      reservationId: reservation?.id || null,
    };
  });
}

async function mockGetReservationByTable(tableId) {
  await delay(300);
  const reservation = MOCK_RESERVATIONS.find(
    (item) => item.tableId === tableId && activeStatusesForTable().includes(item.status)
  );
  return reservation ? withTotals(reservation) : null;
}

async function mockGetReservationById(id) {
  await delay(300);
  const found = MOCK_RESERVATIONS.find((item) => item.id === id);
  if (!found) {
    throw new Error("Reservasi tidak ditemukan.");
  }
  return withTotals(found);
}

async function mockGetMemberReservations(memberId) {
  await delay();
  return MOCK_RESERVATIONS.filter((item) => item.memberId === memberId)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(withTotals);
}

async function mockCreateReservation(payload) {
  await delay();
  const tableTaken = MOCK_RESERVATIONS.some(
    (item) => item.tableId === payload.tableId && activeStatusesForTable().includes(item.status)
  );
  if (tableTaken) {
    throw new Error("Meja yang dipilih sudah dipesan. Silakan pilih meja lain.");
  }
  const newReservation = {
    id: generateReservationId(),
    status: "pending",
    createdAt: new Date().toISOString().slice(0, 10),
    ...payload,
  };
  MOCK_RESERVATIONS = [newReservation, ...MOCK_RESERVATIONS];
  return withTotals(newReservation);
}

async function mockCancelReservation(id) {
  await delay(300);
  let updated = null;
  MOCK_RESERVATIONS = MOCK_RESERVATIONS.map((item) => {
    if (item.id === id) {
      updated = { ...item, status: "canceled" };
      return updated;
    }
    return item;
  });
  if (!updated) {
    throw new Error("Reservasi tidak ditemukan.");
  }
  return withTotals(updated);
}

async function mockConfirmReservation(id) {
  await delay(300);
  let updated = null;
  MOCK_RESERVATIONS = MOCK_RESERVATIONS.map((item) => {
    if (item.id === id) {
      updated = { ...item, status: "confirmed" };
      return updated;
    }
    return item;
  });
  if (!updated) {
    throw new Error("Reservasi tidak ditemukan.");
  }
  return withTotals(updated);
}

export async function getTables() {
  if (MOCK_RESERVATION_ENABLED) {
    return mockGetTables();
  }
  const { data } = await axiosInstance.get(RESERVATION_ENDPOINTS.tables);
  return data;
}

export async function getReservationByTable(tableId) {
  if (MOCK_RESERVATION_ENABLED) {
    return mockGetReservationByTable(tableId);
  }
  const { data } = await axiosInstance.get(RESERVATION_ENDPOINTS.detail(tableId));
  return data;
}

export async function getReservationById(id) {
  if (MOCK_RESERVATION_ENABLED) {
    return mockGetReservationById(id);
  }
  const { data } = await axiosInstance.get(RESERVATION_ENDPOINTS.detail(id));
  return data;
}

export async function getMemberReservations(memberId) {
  if (MOCK_RESERVATION_ENABLED) {
    return mockGetMemberReservations(memberId);
  }
  const { data } = await axiosInstance.get(RESERVATION_ENDPOINTS.byMember(memberId));
  return data;
}

export async function createReservation(payload) {
  if (MOCK_RESERVATION_ENABLED) {
    return mockCreateReservation(payload);
  }
  const { data } = await axiosInstance.post(RESERVATION_ENDPOINTS.create, payload);
  return data;
}

export async function cancelReservation(id) {
  if (MOCK_RESERVATION_ENABLED) {
    return mockCancelReservation(id);
  }
  const { data } = await axiosInstance.post(RESERVATION_ENDPOINTS.cancel(id));
  return data;
}

export async function confirmReservation(id) {
  if (MOCK_RESERVATION_ENABLED) {
    return mockConfirmReservation(id);
  }
  const { data } = await axiosInstance.post(RESERVATION_ENDPOINTS.confirm(id));
  return data;
}

export const RESERVATION_FEE_AMOUNT = RESERVATION_FEE;
export const RESERVATION_TAX_RATE = TAX_RATE;
