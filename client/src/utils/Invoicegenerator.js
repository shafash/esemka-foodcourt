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

const COLOR = {
  primary: [154, 52, 18], 
  primaryStrong: [120, 31, 0], 
  primarySoft: [247, 233, 224], 
  surfaceLow: [250, 242, 235], 
  text: [41, 37, 36], 
  muted: [87, 83, 78], 
  border: [231, 229, 228], 
  white: [255, 255, 255],
};

const STATUS_COLOR = {
  pending: [180, 83, 9], 
  confirmed: [21, 128, 61], 
  completed: [31, 90, 168],
  canceled: [186, 26, 26],
};

const PAGE_WIDTH = 210;
const MARGIN = 14;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function sanitizeFilenamePart(value, fallback = "reservation") {
  const cleaned = String(value ?? "")
    .trim()
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleaned || fallback;
}

function drawHeader(doc, reservation) {
  doc.setFillColor(...COLOR.primary);
  doc.rect(0, 0, PAGE_WIDTH, 38, "F");

  doc.setTextColor(...COLOR.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.text("Esemka Foodcourt", MARGIN, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Reservation Invoice", MARGIN, 26);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`#${reservation.id}`, PAGE_WIDTH - MARGIN, 17, { align: "right" });

  const status = reservation.status;
  const statusLabel = STATUS_LABEL[status] || status || "-";
  const statusColor = STATUS_COLOR[status] || COLOR.muted;
  const pillWidth = doc.getTextWidth(statusLabel) + 10;
  const pillX = PAGE_WIDTH - MARGIN - pillWidth;

  doc.setFillColor(...COLOR.white);
  doc.roundedRect(pillX, 21, pillWidth, 7, 3.5, 3.5, "F");
  doc.setTextColor(...statusColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(statusLabel.toUpperCase(), pillX + pillWidth / 2, 25.6, {
    align: "center",
  });

  if (reservation.createdAt) {
    doc.setTextColor(...COLOR.white);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(
      `Issued ${formatDate(reservation.createdAt)}`,
      PAGE_WIDTH - MARGIN,
      33,
      { align: "right" }
    );
  }
}

function drawInfoCard(doc, { x, y, width, label, lines }) {
  const lineHeight = 5.2;
  const height = 12 + lines.length * lineHeight;

  doc.setFillColor(...COLOR.surfaceLow);
  doc.setDrawColor(...COLOR.border);
  doc.setLineWidth(0.2);
  doc.roundedRect(x, y, width, height, 2.5, 2.5, "FD");

  doc.setTextColor(...COLOR.muted);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(label.toUpperCase(), x + 6, y + 8);

  doc.setTextColor(...COLOR.text);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  lines.forEach((line, index) => {
    doc.text(line, x + 6, y + 15 + index * lineHeight);
  });

  return height;
}

function drawContinuationHeader(doc) {
  doc.setFillColor(...COLOR.primary);
  doc.rect(0, 0, PAGE_WIDTH, 12, "F");
  doc.setTextColor(...COLOR.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Esemka Foodcourt — Reservation Invoice", MARGIN, 8);
}

function drawFooters(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);

    doc.setDrawColor(...COLOR.border);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, pageHeight - 18, PAGE_WIDTH - MARGIN, pageHeight - 18);

    doc.setTextColor(...COLOR.muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      "Thank you for dining with Esemka Foodcourt.",
      MARGIN,
      pageHeight - 12
    );
    doc.text(
      `Page ${page} of ${pageCount}`,
      PAGE_WIDTH - MARGIN,
      pageHeight - 12,
      { align: "right" }
    );
  }
}

/**
 * @param {Object} reservation 
 */
export function generateReservationInvoicePdf(reservation) {
  if (!reservation || !reservation.id) {
    throw new Error("Reservation data is missing, cannot generate invoice.");
  }

  const doc = new jsPDF();
  const customerName =
    `${reservation.firstName || ""} ${reservation.lastName || ""}`.trim() ||
    "-";
  const items = reservation.items || [];

  drawHeader(doc, reservation);

  const cardY = 48;
  const cardWidth = (CONTENT_WIDTH - 8) / 2;

  const billToLines = [
    customerName,
    reservation.email || null,
    reservation.phone || null,
  ].filter(Boolean);

  const detailLines = [
    `Date: ${formatDate(reservation.date)}`,
    reservation.time ? `Time: ${reservation.time}` : null,
    reservation.tableId ? `Table: ${reservation.tableId}` : null,
    reservation.guests != null ? `Guests: ${reservation.guests}` : null,
  ].filter(Boolean);

  const cardHeight = Math.max(
    drawInfoCard(doc, {
      x: MARGIN,
      y: cardY,
      width: cardWidth,
      label: "Bill To",
      lines: billToLines,
    }),
    drawInfoCard(doc, {
      x: MARGIN + cardWidth + 8,
      y: cardY,
      width: cardWidth,
      label: "Reservation Details",
      lines: detailLines,
    })
  );

  const tableStartY = cardY + cardHeight + 10;

  autoTable(doc, {
    startY: tableStartY,
    head: [["Item", "Qty", "Price", "Subtotal"]],
    body: items.map((item) => [
      item.name,
      item.qty,
      formatCurrency(item.price),
      formatCurrency(item.price * item.qty),
    ]),
    theme: "striped",
    styles: {
      fontSize: 9,
      textColor: COLOR.text,
      lineColor: COLOR.border,
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: COLOR.primary,
      textColor: COLOR.white,
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: COLOR.surfaceLow },
    columnStyles: {
      1: { halign: "center", cellWidth: 18 },
      2: { halign: "right", cellWidth: 32 },
      3: { halign: "right", cellWidth: 32 },
    },
    margin: { left: MARGIN, right: MARGIN, top: 16 },
    didDrawPage: (data) => {
      if (data.pageNumber > 1) {
        drawContinuationHeader(doc);
      }
    },
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
    styles: { fontSize: 9.5, textColor: COLOR.text, cellPadding: 2.2 },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { halign: "right", cellWidth: 32 },
    },
    margin: { left: PAGE_WIDTH - MARGIN - 92 },
    didParseCell: (data) => {
      if (data.row.index === totalsRows.length - 1) {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fontSize = 11;
        data.cell.styles.textColor = COLOR.primaryStrong;
        data.cell.styles.fillColor = COLOR.primarySoft;
      }
    },
  });

  drawFooters(doc);

  const dateSlug = sanitizeFilenamePart(
    reservation.date || new Date().toISOString().slice(0, 10)
  );
  const nameSlug = sanitizeFilenamePart(customerName);
  const filename = reservation.id
    ? `invoice-${sanitizeFilenamePart(reservation.id)}.pdf`
    : `invoice-${dateSlug}-${nameSlug}.pdf`;

  doc.save(filename);
}