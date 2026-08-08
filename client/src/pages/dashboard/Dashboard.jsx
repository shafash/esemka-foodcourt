import { useMemo } from "react";
import { FiCalendar, FiClipboard, FiTag, FiUsers, FiEye, FiCheck, FiX } from "react-icons/fi";

import Header from "../../components/layout/Header";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";
import StatusBadge from "../../components/common/StatusBadge";
import AreaChart from "../../components/common/AreaChart";
import StatisticCard from "../../components/dashboard/StatisticCard";

import useAuth from "../../hooks/useAuth";
import useFetch from "../../hooks/useFetch";
import {
  getSummaryStats,
  getRecentReservations,
  getStockAlerts,
} from "../../services/dashboard.service";

import "../../styles/dashboard.css";

const RESERVATION_COLUMNS = [
  {
    key: "customer",
    header: "Customer",
    render: (row) => (
      <div>
        <p className="table-cell__primary">{row.customer}</p>
        <p className="table-cell__secondary">{row.email}</p>
      </div>
    ),
  },
  {
    key: "date",
    header: "Date",
    render: (row) => (
      <div>
        <p className="table-cell__primary">{row.date}</p>
        <p className="table-cell__secondary">{row.time}</p>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <StatusBadge status={row.status} />,
  },
];

function Dashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading: isStatsLoading } = useFetch(getSummaryStats);
  const { data: reservations, isLoading: isReservationsLoading } = useFetch(
    getRecentReservations
  );
  const { data: alerts, isLoading: isAlertsLoading } = useFetch(getStockAlerts);

  const statCards = useMemo(
    () => [
      {
        key: "reservations",
        label: "Total Reservations",
        value: stats?.totalReservations,
        caption: stats?.totalReservationsCaption,
        icon: <FiCalendar />,
      },
      {
        key: "menus",
        label: "Total Menus",
        value: stats?.totalMenus,
        caption: stats?.totalMenusCaption,
        icon: <FiClipboard />,
      },
      {
        key: "categories",
        label: "Total Categories",
        value: stats?.totalCategories,
        caption: stats?.totalCategoriesCaption,
        icon: <FiTag />,
      },
      {
        key: "customers",
        label: "Total Customers",
        value: stats?.totalCustomers,
        caption: stats?.totalCustomersCaption,
        icon: <FiUsers />,
      },
    ],
    [stats]
  );

  return (
    <>
      <Header title="Dashboard" />

      <div className="dashboard-hero">
        <h2 className="dashboard-hero__title">Welcome, {user?.firstName}</h2>
        <p className="dashboard-hero__subtitle">
          Manage your foodcourt operations, monitor menu performance, and
          track member engagement — all from one central command center.
        </p>
      </div>

      <div className="dashboard-grid">
        {statCards.map((stat) =>
          isStatsLoading ? (
            <LoadingSkeleton key={stat.key} variant="stat-card" />
          ) : (
            <StatisticCard
              key={stat.key}
              label={stat.label}
              value={stat.value ?? "-"}
              caption={stat.caption}
              icon={stat.icon}
            />
          )
        )}
      </div>

      <div className="dashboard-section">
        <Card title="Reservation Trend" subtitle="7 hari terakhir (data dummy)">
          {isStatsLoading ? (
            <LoadingSkeleton variant="card" />
          ) : (
            <AreaChart data={stats?.chartSeries || []} />
          )}
        </Card>
      </div>

      <div className="dashboard-section dashboard-columns">
        <Card
          title="Recent Reservations"
          headerAction={
            <Button variant="ghost" size="sm" disabled title="Tersedia di Milestone Reservation">
              View All
            </Button>
          }
        >
          {isReservationsLoading ? (
            <LoadingSkeleton variant="table-row" count={4} />
          ) : reservations && reservations.length > 0 ? (
            <Table
              columns={RESERVATION_COLUMNS}
              data={reservations}
              getRowId={(row) => row.id}
              renderActions={(row) =>
                row.status === "pending" ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      icon={<FiCheck />}
                      aria-label="Konfirmasi reservasi"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      icon={<FiX />}
                      aria-label="Tolak reservasi"
                    />
                  </>
                ) : (
                  <Button variant="ghost" size="sm" icon={<FiEye />}>
                    View
                  </Button>
                )
              }
            />
          ) : (
            <EmptyState
              title="Belum ada reservasi"
              description="Reservasi terbaru akan muncul di sini."
            />
          )}
        </Card>

        <Card title="Stock Alerts">
          {isAlertsLoading ? (
            <LoadingSkeleton variant="text" count={3} />
          ) : alerts && alerts.length > 0 ? (
            <div>
              {alerts.map((alert) => (
                <div className="stock-alert" key={alert.id}>
                  <span className="stock-alert__bar" />
                  <div>
                    <p className="stock-alert__title">{alert.title}</p>
                    <p className="stock-alert__description">{alert.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Tidak ada peringatan stok"
              description="Semua bahan baku dalam kondisi aman saat ini."
            />
          )}
        </Card>
      </div>
    </>
  );
}

export default Dashboard;