import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { formatDate } from "./formatDate";

const STATUS_LABEL = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  canceled: "Cancelled",
};

/**
 * Builds and downloads a PDF report covering the full reservation list
 * (not just the page currently shown in the pagination UI).
 *
 * @param {Array} reservations - Mapped reservation summaries, each with
 *   at least: id, firstName, lastName, date, time, tableId, guests, status.
 */
export function generateReservationReportPdf(reservations = []) {
  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFontSize(14);
  doc.text("Esemka Foodcourt - Reservation Report", 14, 16);

  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(
    `Generated on ${new Date().toLocaleString("en-US")}  |  Total records: ${reservations.length}`,
    14,
    22
  );

  autoTable(doc, {
    startY: 28,
    head: [
      [
        "Reservation ID",
        "Customer",
        "Date",
        "Time",
        "Table",
        "Number of People",
        "Status",
      ],
    ],
    body: reservations.map((r) => [
      r.id,
      `${r.firstName || ""} ${r.lastName || ""}`.trim(),
      formatDate(r.date),
      r.time || "-",
      r.tableId || "-",
      r.guests ?? "-",
      STATUS_LABEL[r.status] || r.status || "-",
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [154, 52, 18] },
  });

  doc.save(`reservation-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}