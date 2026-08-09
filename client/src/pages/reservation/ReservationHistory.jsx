import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/layout/Header";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

import useAuth from "../../hooks/useAuth";
import useFetch from "../../hooks/useFetch";
import { getMemberReservations, cancelReservation } from "../../services/reservation.service";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

import "../../styles/reservation.css";

const TABS = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
];

function ReservationHistory() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);

  const fetchReservations = useCallback(
    () => (user?.id ? getMemberReservations(user.id) : Promise.resolve([])),
    [user]
  );
  const { data, isLoading, refetch } = useFetch(fetchReservations);

  const reservations = data || [];
  const filtered =
    activeTab === "upcoming"
      ? reservations.filter((item) => ["pending", "confirmed"].includes(item.status))
      : reservations;

  const selected = filtered.find((item) => item.id === selectedId) || filtered[0] || null;

  const handleCancel = async () => {
    if (!selected) return;
    setIsCanceling(true);
    try {
      await cancelReservation(selected.id);
      refetch();
    } finally {
      setIsCanceling(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header title="Reservation History" subtitle="Review your past and upcoming bookings." />
        <Loader centered label="Memuat riwayat reservasi..." />
      </>
    );
  }

  return (
    <>
      <Header title="Reservation History" subtitle="Review your past and upcoming bookings." />

      <div className="history-page">
        <div>
          <div className="history-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`history-tabs__button${
                  activeTab === tab.key ? " history-tabs__button--active" : ""
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              title="Belum ada reservasi"
              description="Reservasi yang kamu buat akan muncul di sini."
              actionLabel="Reserve Table"
              onAction={() => navigate("/reservation/reserve")}
            />
          ) : (
            filtered.map((item) => (
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
            ))
          )}
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
            {selected.items.map((item, index) => (
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
              {["pending", "confirmed"].includes(selected.status) && (
                <Button variant="danger" onClick={handleCancel} disabled={isCanceling}>
                  {isCanceling ? "Canceling..." : "Cancel Reservation"}
                </Button>
              )}
              <Button variant="primary" disabled title="Fitur invoice akan tersedia setelah integrasi backend">
                Download Invoice
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ReservationHistory;
