import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { formatCurrency } from "./formatCurrency";
import { formatDate } from "./formatDate";
import { RESERVATION_FEE_AMOUNT } from "../services/reservation.service";

const STATUS_LABEL = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  canceled: "Cancelled",
};

/** Keep only filesystem-safe characters for the download filename. */
function sanitizeFilenamePart(value, fallback = "reservation") {
  const cleaned = String(value ?? "")
    .trim()
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleaned || fallback;
}

/**
 * Builds and downloads a PDF invoice for a single reservation.
 *
 * Only uses data that already exists on the reservation object (as
 * produced by mapReservationSummary / mapReservationDetail in
 * reservation.service.js) - no fabricated business/payment data is added.
 *
 * @param {Object} reservation - Reservation detail, expected to include:
 *   id, firstName, lastName, email, phone, tableId, date, time, guests,
 *   status, items (array of {name, price, qty}), menuTotal, tax, total.
 */
export function generateReservationInvoicePdf(reservation) {
  if (!reservation || !reservation.id) {
    throw new Error("Reservation data is missing, cannot generate invoice.");
  }

  const doc = new jsPDF();
  const customerName = `${reservation.firstName || ""} ${reservation.lastName || ""}`.trim() || "-";
  const items = reservation.items || [];

  doc.setFontSize(16);
  doc.text("Esemka Foodcourt", 14, 18);

  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text("Reservation Invoice", 14, 25);

  doc.setTextColor(0);
  doc.setFontSize(11);
  doc.text(`Invoice for Reservation #${reservation.id}`, 14, 36);
  doc.text(`Status: ${STATUS_LABEL[reservation.status] || reservation.status || "-"}`, 14, 43);

  doc.setFontSize(10);
  const customerLines = [
    `Customer: ${customerName}`,
    reservation.email ? `Email: ${reservation.email}` : null,
    reservation.phone ? `Phone: ${reservation.phone}` : null,
  ].filter(Boolean);
  doc.text(customerLines, 14, 53);

  const reservationLines = [
    `Date: ${formatDate(reservation.date)}`,
    reservation.time ? `Time: ${reservation.time}` : null,
    reservation.tableId ? `Table: ${reservation.tableId}` : null,
    reservation.guests != null ? `Guests: ${reservation.guests}` : null,
  ].filter(Boolean);
  doc.text(reservationLines, 120, 53);

  const tableStartY = 53 + Math.max(customerLines.length, reservationLines.length) * 5 + 8;

  autoTable(doc, {
    startY: tableStartY,
    head: [["Item", "Qty", "Price", "Subtotal"]],
    body: items.map((item) => [
      item.name,
      item.qty,
      formatCurrency(item.price),
      formatCurrency(item.price * item.qty),
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [154, 52, 18] },
  });

  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 8 : tableStartY + 20;

  const totalsRows = [["Subtotal", formatCurrency(reservation.menuTotal)]];
  if (RESERVATION_FEE_AMOUNT) {
    totalsRows.push(["Reservation Fee", formatCurrency(RESERVATION_FEE_AMOUNT)]);
  }
  if (reservation.tax != null) {
    totalsRows.push(["Tax", formatCurrency(reservation.tax)]);
  }
  totalsRows.push(["Total", formatCurrency(reservation.total)]);

  autoTable(doc, {
    startY: finalY,
    body: totalsRows,
    theme: "plain",
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: "normal", cellWidth: 60 },
      1: { halign: "right" },
    },
    margin: { left: 120 },
    didParseCell: (data) => {
      if (data.row.index === totalsRows.length - 1) {
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  const dateSlug = sanitizeFilenamePart(reservation.date || new Date().toISOString().slice(0, 10));
  const nameSlug = sanitizeFilenamePart(customerName);
  const filename = reservation.id
    ? `invoice-${sanitizeFilenamePart(reservation.id)}.pdf`
    : `invoice-${dateSlug}-${nameSlug}.pdf`;

  doc.save(filename);
}