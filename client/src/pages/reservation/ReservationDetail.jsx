import { FiInfo, FiX } from "react-icons/fi";

import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import Loader from "../../components/common/Loader";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

function ReservationDetail({
  table,
  reservation,
  isLoading,
  onConfirm,
  onCancel,
  onComplete,
  onClose,
  isUpdating = false,
}) {
  if (!table) {
    return (
      <div className="reservation-detail">
        <div className="reservation-detail__empty">
          <span className="reservation-detail__empty-icon">
            <FiInfo size={18} />
          </span>
          <h4>No Table Selected</h4>
          <p>Click on a table in floor plan to view reservation details and orders.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="reservation-detail reservation-detail--open">
        <Loader centered label="Memuat detail reservasi..." />
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="reservation-detail reservation-detail--open">
        <div className="reservation-detail__header">
          <div>
            <h3 className="reservation-detail__title">Table {table.id}</h3>
          </div>
          <button
            type="button"
            className="reservation-detail__close"
            onClick={onClose}
            aria-label="Tutup detail reservasi"
          >
            <FiX size={18} />
          </button>
        </div>
        <div className="reservation-detail__empty">
          <span className="reservation-detail__empty-icon">
            <FiInfo size={18} />
          </span>
          <h4>Meja Kosong</h4>
          <p>Meja ini belum memiliki reservasi aktif.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reservation-detail reservation-detail--open">
      <div className="reservation-detail__header">
        <div>
          <h3 className="reservation-detail__title">Table {table.id}</h3>
          <StatusBadge status={reservation.status} />
        </div>
        <span className="reservation-detail__id">Reservation ID #{reservation.id}</span>
        <button
          type="button"
          className="reservation-detail__close"
          onClick={onClose}
          aria-label="Tutup detail reservasi"
        >
          <FiX size={18} />
        </button>
      </div>

      <div className="reservation-detail__row">
        <div className="reservation-detail__field">
          <span className="reservation-detail__label">First Name</span>
          <span className="reservation-detail__value">{reservation.firstName}</span>
        </div>
        <div className="reservation-detail__field">
          <span className="reservation-detail__label">Last Name</span>
          <span className="reservation-detail__value">{reservation.lastName}</span>
        </div>
      </div>
      <div className="reservation-detail__field">
        <span className="reservation-detail__label">Email Address</span>
        <span className="reservation-detail__value">{reservation.email}</span>
      </div>
      <div className="reservation-detail__field">
        <span className="reservation-detail__label">Phone Number</span>
        <span className="reservation-detail__value">{reservation.phone}</span>
      </div>
      <div className="reservation-detail__field">
        <span className="reservation-detail__label">Date &amp; Time</span>
        <span className="reservation-detail__value">
          {formatDate(reservation.date)} {reservation.time}
        </span>
      </div>

      <p className="reservation-detail__section-title">Order Items</p>
      {reservation.items.map((item, index) => (
        <div className="reservation-detail__order-item" key={`${item.menuId}-${index}`}>
          <div>
            <div>{item.name}</div>
            <div className="reservation-detail__order-item-meta">
              Qty: {item.qty} · Price: {formatCurrency(item.price)}
            </div>
          </div>
          <strong>{formatCurrency(item.price * item.qty)}</strong>
        </div>
      ))}

      <div className="reservation-detail__totals">
        <div className="reservation-detail__totals-row">
          <span>Tax (10%)</span>
          <span>{formatCurrency(reservation.tax)}</span>
        </div>
        <div className="reservation-detail__totals-row reservation-detail__totals-row--total">
          <span>Total</span>
          <span>{formatCurrency(reservation.total)}</span>
        </div>
      </div>

      {reservation.status === "pending" ? (
        <div className="reservation-detail__actions">
          <Button variant="secondary" onClick={() => onCancel?.(reservation)} disabled={isUpdating}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => onConfirm?.(reservation)} disabled={isUpdating}>
            Confirm order
          </Button>
        </div>
      ) : reservation.status === "confirmed" ? (
        <div className="reservation-detail__actions">
          <Button variant="secondary" onClick={() => onCancel?.(reservation)} disabled={isUpdating}>
            Cancel Reservation
          </Button>
          <Button variant="primary" onClick={() => onComplete?.(reservation)} disabled={isUpdating}>
            Complete Reservation
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default ReservationDetail;