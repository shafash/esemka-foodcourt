import { useCallback, useMemo, useState } from "react";
import {
  FiCalendar,
  FiClipboard,
  FiUsers,
  FiEye,
  FiCheck,
  FiX,
  FiBarChart2,
  FiDownload,
} from "react-icons/fi";

import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import Header from "../../components/layout/Header";
import EmptyState from "../../components/common/EmptyState";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";
import StatusBadge from "../../components/common/StatusBadge";
import StatisticCard from "../../components/dashboard/StatisticCard";

import useAuth from "../../hooks/useAuth";
import useFetch from "../../hooks/useFetch";

import { getSummaryStats, getRecentReservations } from "../../services/dashboard.service.js";
import {
  confirmReservation,
  cancelReservation,
  completeReservation,
  getReservationById,
  getAdminReservations,
  getAllReservationsForReport,
} from "../../services/reservation.service";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { generateReservationReportPdf } from "../../utils/reservationReport";
import { ROLE_MEMBER } from "../../constants/roles";
import MemberDashboard from "./MemberDashboard";

import "../../styles/dashboard.css";
import "../../styles/reservation.css";

const MIN_RESERVATIONS_FOR_REPORT = 10;
const ALL_RESERVATIONS_PAGE_SIZE = 10;

const RESERVATION_COLUMNS = [
  {
    key: "customer",
    header: "Customer",
    width: "minmax(0, 1fr)",
    render: (row) => (
      <div className="reservation-item reservation-item--customer">
        <div className="reservation-item__content reservation-item__content--left">
          <strong className="table-cell__primary reservation-item__primary">
            {row.customer}
          </strong>
          <span className="table-cell__secondary reservation-item__secondary">
            {row.email}
          </span>
        </div>
      </div>
    ),
  },
  {
    key: "date",
    header: "Date",
    width: "170px",
    render: (row) => (
      <div className="reservation-item reservation-item--date">
        <div className="reservation-item__content reservation-item__content--right">
          <strong className="table-cell__primary reservation-item__primary">
            {row.date}
          </strong>
          <span className="table-cell__secondary reservation-item__secondary">
            {row.time}
          </span>
        </div>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <StatusBadge status={row.status} />,
  },
];

const ALL_RESERVATIONS_COLUMNS = [
  {
    key: "customer",
    header: "Customer",
    render: (row) => `${row.firstName} ${row.lastName}`,
  },
  {
    key: "date",
    header: "Date",
    render: (row) => formatDate(row.date),
  },
  {
    key: "time",
    header: "Time",
  },
  {
    key: "table",
    header: "Table",
    render: (row) => row.tableId,
  },
  {
    key: "guests",
    header: "Number of People",
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <StatusBadge status={row.status} />,
  },
];

function ReservationActions({ row, onUpdate, onView }) {
  const handleConfirm = async () => {
    try {
      await confirmReservation(row.id);
      onUpdate();
    } catch (error) {
      console.error("Gagal confirm reservation:", error);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelReservation(row.id);
      onUpdate();
    } catch (error) {
      console.error("Gagal cancel reservation:", error);
    }
  };

  if (row.status === "pending") {
    return (
      <>
        <Button
          variant="success"
          size="sm"
          iconOnly
          icon={<FiCheck />}
          aria-label="Approve reservasi"
          onClick={handleConfirm}
        />

        <Button
          variant="danger"
          size="sm"
          iconOnly
          icon={<FiX />}
          aria-label="Batalkan reservasi"
          onClick={handleCancel}
        />
      </>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      icon={<FiEye />}
      aria-label="Lihat detail reservasi"
      onClick={() => onView(row.id)}
    >
    </Button>
  );
}

function ReservationDetailModal({
  isOpen,
  isLoading,
  error,
  reservation,
  onClose,
  onComplete,
  isCompleting,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={reservation ? `Reservation #${reservation.id}` : "Reservation Detail"}
    >
      {isLoading ? (
        <Loader centered label="Memuat detail reservasi..." />
      ) : error ? (
        <div className="reservation-detail__empty">
          <p>{error}</p>
        </div>
      ) : reservation ? (
        <>
          <div className="reservation-detail__row">
            <div className="reservation-detail__field">
              <span className="reservation-detail__label">Customer Name</span>
              <span className="reservation-detail__value">
                {reservation.firstName} {reservation.lastName}
              </span>
            </div>
            <div className="reservation-detail__field">
              <span className="reservation-detail__label">Table</span>
              <span className="reservation-detail__value">
                {reservation.tableId}
              </span>
            </div>
          </div>

          <div className="reservation-detail__row">
            <div className="reservation-detail__field">
              <span className="reservation-detail__label">Email</span>
              <span className="reservation-detail__value">
                {reservation.email}
              </span>
            </div>
            <div className="reservation-detail__field">
              <span className="reservation-detail__label">Phone</span>
              <span className="reservation-detail__value">
                {reservation.phone}
              </span>
            </div>
          </div>

          <div className="reservation-detail__row">
            <div className="reservation-detail__field">
              <span className="reservation-detail__label">Date &amp; Time</span>
              <span className="reservation-detail__value">
                {formatDate(reservation.date)} {reservation.time}
              </span>
            </div>
            <div className="reservation-detail__field">
              <span className="reservation-detail__label">
                Number of Guests
              </span>
              <span className="reservation-detail__value">
                {reservation.guests}
              </span>
            </div>
          </div>

          <div className="reservation-detail__field">
            <span className="reservation-detail__label">Status</span>
            <div>
              <StatusBadge status={reservation.status} />
            </div>
          </div>

          <p className="reservation-detail__section-title">Ordered Menu</p>
          {reservation.items.map((item, index) => (
            <div
              className="reservation-detail__order-item"
              key={`${item.menuId}-${index}`}
            >
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
              <span>Tax</span>
              <span>{formatCurrency(reservation.tax)}</span>
            </div>
            <div className="reservation-detail__totals-row reservation-detail__totals-row--total">
              <span>Total</span>
              <span>{formatCurrency(reservation.total)}</span>
            </div>
          </div>

          {reservation.status === "confirmed" && (
            <div className="reservation-detail__actions">
              <Button
                variant="primary"
                onClick={onComplete}
                disabled={isCompleting}
              >
                {isCompleting ? "Completing..." : "Complete Reservation"}
              </Button>
            </div>
          )}
        </>
      ) : null}
    </Modal>
  );
}

// Lists ALL reservations with server-side pagination (page/limit + backend
// pagination metadata). This modal only shows the list — clicking "View"
// on a row reuses the same reservation detail modal/behavior already used
// by Recent Reservations, via the onView callback passed down from
// AdminDashboard.
function AllReservationsModal({ onClose, onView }) {
  const [page, setPage] = useState(1);

  const fetchReservations = useCallback(
    () => getAdminReservations({ page, limit: ALL_RESERVATIONS_PAGE_SIZE }),
    [page]
  );

  const { data, isLoading, error } = useFetch(fetchReservations);

  const reservations = data?.data || [];
  const totalData = data?.pagination?.totalData ?? 0;

  let content;

  if (isLoading) {
    content = (
      <>
        <div className="skeleton-table-rows">
          <LoadingSkeleton variant="table-row" count={5} />
        </div>
        <div className="skeleton-card-list">
          <LoadingSkeleton variant="card" count={4} />
        </div>
      </>
    );
  } else if (error) {
    content = (
      <div className="reservation-detail__empty">
        <p>{error}</p>
      </div>
    );
  } else if (reservations.length === 0) {
    content = (
      <EmptyState
        title="Belum ada reservasi"
        description="Data reservasi akan muncul di sini."
      />
    );
  } else {
    content = (
      <>
        <Table
          columns={ALL_RESERVATIONS_COLUMNS}
          data={reservations}
          getRowId={(row) => row.id}
          renderActions={(row) => (
            <Button
              variant="ghost"
              size="sm"
              icon={<FiEye />}
              onClick={() => onView(row.id)}
            >
              View
            </Button>
          )}
        />

        <div className="data-card-list">
          {reservations.map((row) => (
            <div className="data-card" key={row.id}>
              <div className="data-card__top">
                <div className="data-card__title-group">
                  <p className="data-card__title">
                    {row.firstName} {row.lastName}
                  </p>
                </div>
                <StatusBadge status={row.status} />
              </div>

              <div className="data-card__meta">
                <div className="data-card__meta-row">
                  <span>
                    {formatDate(row.date)} • {row.time}
                  </span>
                </div>
                <div className="data-card__meta-row">
                  <span>
                    Table {row.tableId} • {row.guests} people
                  </span>
                </div>
              </div>

              <div className="data-card__footer">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<FiEye />}
                  onClick={() => onView(row.id)}
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Pagination
          currentPage={page}
          pageSize={ALL_RESERVATIONS_PAGE_SIZE}
          totalItems={totalData}
          onPageChange={setPage}
        />
      </>
    );
  }

  return (
    <Modal isOpen onClose={onClose} title="All Reservations" variant="lg">
      {content}
    </Modal>
  );
}

function Dashboard() {
  const { user } = useAuth();

  if (user?.role === ROLE_MEMBER) {
    return <MemberDashboard />;
  }

  return <AdminDashboard user={user} />;
}

function AdminDashboard({ user }) {
  const {
    data: stats,
    isLoading: isStatsLoading,
  } = useFetch(getSummaryStats);

  const {
    data: reservations,
    isLoading: isReservationsLoading,
    refetch: refetchReservations,
  } = useFetch(getRecentReservations);

  const [viewReservationId, setViewReservationId] = useState(null);
  const [reservationDetail, setReservationDetail] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);

  const [isAllReservationsOpen, setIsAllReservationsOpen] = useState(false);
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);
  const [reportError, setReportError] = useState(null);

  const openReservationDetail = async (id) => {
    setViewReservationId(id);
    setReservationDetail(null);
    setDetailError(null);
    setIsDetailLoading(true);
    try {
      const detail = await getReservationById(id);
      setReservationDetail(detail);
    } catch (error) {
      console.error("Gagal memuat detail reservasi:", error);
      setDetailError("Gagal memuat detail reservasi.");
    } finally {
      setIsDetailLoading(false);
    }
  };

  const closeReservationDetail = () => {
    setViewReservationId(null);
    setReservationDetail(null);
    setDetailError(null);
  };

  const handleCompleteFromModal = async () => {
    if (!reservationDetail) return;
    setIsCompleting(true);
    try {
      await completeReservation(reservationDetail.id);
      closeReservationDetail();
      refetchReservations();
    } catch (error) {
      console.error("Gagal complete reservation:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDownloadReport = async () => {
    setIsDownloadingReport(true);
    setReportError(null);
    try {
      const allReservations = await getAllReservationsForReport();
      generateReservationReportPdf(allReservations);
    } catch (error) {
      console.error("Gagal membuat laporan reservasi:", error);
      setReportError("Gagal membuat laporan reservasi.");
    } finally {
      setIsDownloadingReport(false);
    }
  };

  const totalReservations = stats?.totalReservations ?? 0;
  const canDownloadReport = totalReservations > MIN_RESERVATIONS_FOR_REPORT;

  const statCards = useMemo(
    () => [
      {
        key: "members",
        label: "Total Members",
        value: stats?.totalMembers,
        caption: stats?.totalMembersCaption,
        icon: <FiUsers />,
      },
      {
        key: "menus",
        label: "Active Menus",
        value: stats?.activeMenus,
        caption: stats?.activeMenusCaption,
        icon: <FiClipboard />,
      },
      {
        key: "reservations",
        label: "Today's Reservations",
        value: stats?.todaysReservations,
        caption: stats?.todaysReservationsCaption,
        icon: <FiCalendar />,
      },
    ],
    [stats]
  );

  let reservationsContent;

  if (isReservationsLoading) {
    reservationsContent = (
      <>
        <div className="skeleton-table-rows">
          <LoadingSkeleton variant="table-row" count={4} />
        </div>
        <div className="skeleton-card-list">
          <LoadingSkeleton variant="card" count={3} />
        </div>
      </>
    );
  } else if (reservations && reservations.length > 0) {
    reservationsContent = (
      <>
        <Table
          columns={RESERVATION_COLUMNS}
          data={reservations}
          getRowId={(row) => row.id}
          renderActions={(row) => (
          <ReservationActions
            row={row}
            onUpdate={refetchReservations}
            onView={openReservationDetail}
          />
        )}
        />

        <div className="data-card-list">
          {reservations.map((row) => (
            <div className="data-card" key={row.id}>
              <div className="data-card__top">
                <div className="data-card__title-group">
                  <p className="data-card__title">{row.customer}</p>
                  <span className="data-card__id">{row.email}</span>
                </div>
                <StatusBadge status={row.status} />
              </div>

              <div className="data-card__meta">
                <div className="data-card__meta-row">
                  <span>
                    {row.date} • {row.time}
                  </span>
                </div>
              </div>

              <div className="data-card__footer">
                <ReservationActions
                  row={row}
                  onUpdate={refetchReservations}
                  onView={openReservationDetail}
                />
              </div>
            </div>
          ))}
        </div>
      </>
    );
  } else {
    reservationsContent = (
      <EmptyState
        title="Belum ada reservasi"
        description="Reservasi terbaru akan muncul di sini."
      />
    );
  }

  return (
    <>
      <Header title="Dashboard" />

      <div className="dashboard-hero">
        <h2 className="dashboard-hero__title">
          Welcome, {user?.firstName}
        </h2>

        <p className="dashboard-hero__subtitle">
          Manage your foodcourt operations, monitor menu performance,
          and track member engagement — all from one central command
          center.
        </p>
      </div>

      <div className="dashboard-grid">
        {statCards.map((stat) => {
          if (isStatsLoading) {
            return (
              <LoadingSkeleton
                key={stat.key}
                variant="stat-card"
              />
            );
          }

          return (
            <StatisticCard
              key={stat.key}
              label={stat.label}
              value={stat.value ?? "-"}
              caption={stat.caption}
              icon={stat.icon}
            />
          );
        })}
      </div>

      <div className="dashboard-section dashboard-columns">
        <Card
          title="Recent Reservations"
          headerAction={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAllReservationsOpen(true)}
            >
              View All
            </Button>
          }
        >
          {reservationsContent}
        </Card>

        <div className="dashboard-columns__side">
          <Card className="performance-card">
            <span className="performance-card__icon">
              <FiBarChart2 size={22} />
            </span>
            <h3 className="performance-card__title">Performance Reports</h3>
            <p className="performance-card__description">
              Generate a full reservation report covering every reservation
              in the system.
            </p>
            <Button
              variant="primary"
              className="button--cta"
              icon={<FiDownload />}
              onClick={handleDownloadReport}
              disabled={!canDownloadReport || isDownloadingReport}
              title={
                canDownloadReport
                  ? undefined
                  : `Tersedia setelah reservasi lebih dari ${MIN_RESERVATIONS_FOR_REPORT}`
              }
            >
              {isDownloadingReport ? "Generating..." : "Download Report"}
            </Button>
            {reportError && (
              <p className="reservation-detail__empty">{reportError}</p>
            )}
          </Card>
        </div>
      </div>

      <ReservationDetailModal
        isOpen={Boolean(viewReservationId)}
        isLoading={isDetailLoading}
        error={detailError}
        reservation={reservationDetail}
        onClose={closeReservationDetail}
        onComplete={handleCompleteFromModal}
        isCompleting={isCompleting}
      />

      {isAllReservationsOpen && (
        <AllReservationsModal
          onClose={() => setIsAllReservationsOpen(false)}
          onView={openReservationDetail}
        />
      )}
    </>
  );
}

export default Dashboard;