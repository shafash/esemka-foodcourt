import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import Header from "../../components/layout/Header";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

import useAuth from "../../hooks/useAuth";
import useFetch from "../../hooks/useFetch";
import { getMemberReservations, cancelMyReservation } from "../../services/reservation.service";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { generateReservationInvoicePdf } from "../../utils/Invoicegenerator";

import Modal from "../../components/common/Modal";

import "../../styles/reservation.css";

function ReservationHistory() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedId, setSelectedId] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchReservations = useCallback(
    () => (user?.id ? getMemberReservations(user.id) : Promise.resolve([])),
    [user]
  );
  const { data, isLoading, refetch } = useFetch(fetchReservations);

  const reservations = data || [];
  const filtered = reservations;

  const selected = filtered.find((item) => item.id === selectedId) || filtered[0] || null;

  const [cancelTarget, setCancelTarget] = useState(null);

  const openCancelConfirm = (reservation) => setCancelTarget(reservation);
  const closeCancelConfirm = () => setCancelTarget(null);

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    setIsCanceling(true);
    try {
      await cancelMyReservation(cancelTarget.id);
      setCancelTarget(null);
      refetch();
    } finally {
      setIsCanceling(false);
    }
  };

  const handleDownloadInvoice = async (reservation) => {
    if (!reservation || downloadingId) return;
    setDownloadingId(reservation.id);
    try {
      generateReservationInvoicePdf(reservation);
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("Gagal membuat invoice reservasi:", error);
      toast.error("Failed to download invoice. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header title="History Reservation" />
        <Loader centered label="Memuat riwayat reservasi..." />
      </>
    );
  }

  return (
    <>
      <Header title="History Reservation" />

      {filtered.length === 0 ? (
        <div className="history-page history-page--empty">
          <div className="history-panel-header">
            <h2 className="history-panel-header__title">History</h2>
          </div>

          <div className="history-page__empty">
            <EmptyState
              title="Belum ada reservasi"
              description="Reservasi yang kamu buat akan muncul di sini."
              actionLabel="Reserve Table"
              onAction={() => navigate("/reservation/reserve")}
            />
          </div>
        </div>
      ) : (
      <div className="history-page">
        <div>
          <div className="history-panel-header">
            <h2 className="history-panel-header__title">History</h2>
          </div>

          {filtered.map((item) => (
              <div
                key={item.id}
                className={`history-card${selected?.id === item.id ? " history-card--active" : ""}`}
                onClick={() => setSelectedId(item.id)}
              >
                <div className="history-card__top">
                  <StatusBadge status={item.status} />
                  <span className="reservation-detail__id">#{item.id}</span>
                </div>
                <p className="history-card__title">Table {item.tableId}</p>
                <p className="history-card__meta">
                  {formatDate(item.date)} {item.time}
                </p>
                <p className="history-card__guests">{item.guests} Guests</p>
              </div>
            ))}
        </div>

        {selected && (
          <div className="history-detail">
            <div className="history-detail__header">
              <div>
                <h3 className="reservation-detail__title">Table {selected.tableId} Details</h3>
                <span className="reservation-detail__id">Reservation ID: #{selected.id}</span>
              </div>
              <StatusBadge status={selected.status} />
            </div>

            <div className="history-detail__stats">
              <div className="history-detail__stat">
                <span className="history-detail__stat-label">Reservation Date</span>
                <strong>
                  {formatDate(selected.date)} {selected.time}
                </strong>
              </div>
              <div className="history-detail__stat">
                <span className="history-detail__stat-label">Guests</span>
                <strong>{selected.guests} Guests</strong>
              </div>
              <div className="history-detail__stat">
                <span className="history-detail__stat-label">Total Price</span>
                <strong>{formatCurrency(selected.total)}</strong>
              </div>
            </div>

            <p className="reservation-detail__section-title">Ordered Menu Items</p>
            {(selected.items || []).map((item, index) => (
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
                <span>{formatCurrency(selected.tax)}</span>
              </div>
              <div className="reservation-detail__totals-row reservation-detail__totals-row--total">
                <span>Total amount</span>
                <span>{formatCurrency(selected.total)}</span>
              </div>
            </div>

            <div className="history-detail__actions">
              {selected.status === "pending" && (
                <Button variant="danger" onClick={() => openCancelConfirm(selected)} disabled={isCanceling}>
                  Cancel Reservation
                </Button>
              )}
              <Button
                variant="primary"
                onClick={() => handleDownloadInvoice(selected)}
                disabled={downloadingId === selected.id}
              >
                {downloadingId === selected.id ? "Generating..." : "Download Invoice"}
              </Button>
            </div>
          </div>
        )}
      </div>
      )}

      <Modal
        isOpen={Boolean(cancelTarget)}
        onClose={closeCancelConfirm}
        title="Batalkan Reservasi Ini?"
        footer={
          <>
            <Button variant="secondary" onClick={closeCancelConfirm} disabled={isCanceling}>
              Kembali
            </Button>
            <Button variant="danger" onClick={confirmCancel} disabled={isCanceling}>
              {isCanceling ? "Membatalkan..." : "Ya, Batalkan"}
            </Button>
          </>
        }
      >
        <p className="text-muted">
          Reservasi Table {cancelTarget?.tableId} (#{cancelTarget?.id}) akan dibatalkan.
          Tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>
    </>
  );
}

export default ReservationHistory;