import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import Header from "../../components/layout/Header";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

import useAuth from "../../hooks/useAuth";
import useIsMobile from "../../hooks/useIsMobile";
import { getMemberReservations, cancelMyReservation } from "../../services/reservation.service";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { generateReservationInvoicePdf } from "../../utils/Invoicegenerator";

import Modal from "../../components/common/Modal";

import "../../styles/reservation.css";

const PAGE_SIZE = 10;

const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "canceled", label: "Canceled" },
];

function ReservationDetailContent({
  selected,
  isCanceling,
  downloadingId,
  onCancel,
  onDownload,
}) {
  if (!selected) return null;

  return (
    <>
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
          <Button variant="danger" onClick={() => onCancel(selected)} disabled={isCanceling}>
            Cancel Reservation
          </Button>
        )}
        <Button
          variant="primary"
          onClick={() => onDownload(selected)}
          disabled={downloadingId === selected.id}
        >
          {downloadingId === selected.id ? "Generating..." : "Download Invoice"}
        </Button>
      </div>
    </>
  );
}

function ReservationHistory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const [statusFilter, setStatusFilter] = useState("all");
  const [reservations, setReservations] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [selectedId, setSelectedId] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);

  const sentinelRef = useRef(null);

  const loadFirstPage = useCallback(() => {
    if (!user?.id) {
      setReservations([]);
      setIsLoading(false);
      setIsInitialLoading(false);
      return;
    }

    setIsLoading(true);

    getMemberReservations({ page: 1, limit: PAGE_SIZE, status: statusFilter })
      .then((result) => {
        setReservations(result.data);
        setPage(1);
        setHasMore(result.pagination.page < result.pagination.totalPages);
      })
      .catch(() => {
        toast.error("Gagal memuat riwayat reservasi.");
      })
      .finally(() => {
        setIsLoading(false);
        setIsInitialLoading(false);
      });
  }, [user?.id, statusFilter]);

  useEffect(() => {
    setSelectedId(null);
    loadFirstPage();
  }, [loadFirstPage]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || isLoading) return;

    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await getMemberReservations({
        page: nextPage,
        limit: PAGE_SIZE,
        status: statusFilter,
      });

      setReservations((prev) => [...prev, ...result.data]);
      setPage(nextPage);
      setHasMore(result.pagination.page < result.pagination.totalPages);
    } catch {
      toast.error("Gagal memuat data tambahan.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, hasMore, isLoading, isLoadingMore, statusFilter]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  const selected =
    reservations.find((item) => item.id === selectedId) ||
    (!isMobile ? reservations[0] : null) ||
    null;

  const openCancelConfirm = (reservation) => setCancelTarget(reservation);
  const closeCancelConfirm = () => setCancelTarget(null);

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    setIsCanceling(true);
    try {
      await cancelMyReservation(cancelTarget.id);
      setCancelTarget(null);
      setSelectedId(null);
      loadFirstPage();
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

  if (isInitialLoading) {
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

      {reservations.length === 0 && !isLoading ? (
        <div className="history-page history-page--empty">
          <div className="history-panel-header">
            <h2 className="history-panel-header__title">History</h2>
          </div>

          <div className="history-tabs">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.key}
                type="button"
                className={`history-tabs__button${
                  statusFilter === filter.key ? " history-tabs__button--active" : ""
                }`}
                onClick={() => setStatusFilter(filter.key)}
                disabled={isLoading}
              >
                {filter.label}
              </button>
            ))}
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
          <div className="history-list-column">
            <div className="history-panel-header">
              <h2 className="history-panel-header__title">History</h2>
            </div>

            <div className="history-tabs">
              {STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  className={`history-tabs__button${
                    statusFilter === filter.key ? " history-tabs__button--active" : ""
                  }`}
                  onClick={() => setStatusFilter(filter.key)}
                  disabled={isLoading}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div
              className={`history-cards${isLoading ? " history-cards--loading" : ""}`}
            >
              {reservations.map((item) => (
                <div
                  key={item.id}
                  className={`history-card${
                    !isMobile && selected?.id === item.id ? " history-card--active" : ""
                  }`}
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

            <div className="history-list__sentinel" ref={sentinelRef}>
              {isLoadingMore && <Loader label="Memuat lebih banyak..." />}
            </div>
          </div>

          {!isMobile && selected && (
            <div className="history-detail">
              <ReservationDetailContent
                selected={selected}
                isCanceling={isCanceling}
                downloadingId={downloadingId}
                onCancel={openCancelConfirm}
                onDownload={handleDownloadInvoice}
              />
            </div>
          )}
        </div>
      )}

      {isMobile && (
        <Modal isOpen={Boolean(selected)} onClose={() => setSelectedId(null)} variant="drawer">
          <div className="history-detail">
            <ReservationDetailContent
              selected={selected}
              isCanceling={isCanceling}
              downloadingId={downloadingId}
              onCancel={openCancelConfirm}
              onDownload={handleDownloadInvoice}
            />
          </div>
        </Modal>
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