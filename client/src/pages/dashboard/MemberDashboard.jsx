import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiClock, FiGrid, FiCheckSquare, FiUsers, FiAlertTriangle } from "react-icons/fi";

import Header from "../../components/layout/Header";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import FloorPlan from "../../components/reservation/FloorPlan";

import useFetch from "../../hooks/useFetch";
import { getTables } from "../../services/reservation.service";

import "../../styles/reservation.css";

function MemberDashboard() {
  const navigate = useNavigate();

  // getTables() with no date defaults to "today" on the backend. This must
  // be a stable function reference (useCallback with an empty dep array) -
  // useFetch's effect depends on it, and a new arrow function on every
  // render would re-trigger the fetch forever.
  const fetchTables = useCallback(() => getTables(), []);
  const { data: tables, isLoading, error, refetch } = useFetch(fetchTables);

  const stats = useMemo(() => {
    const list = tables || [];
    const reserved = list.filter((t) => t.status === "reserved").length;
    return {
      total: list.length,
      available: list.length - reserved,
      reserved,
    };
  }, [tables]);

  const latestReserved = (tables || []).filter((t) => t.status === "reserved").slice(-2);

  return (
    <>
      <Header title="Reservation" />

      <div className="member-dashboard">
        <Card noPadding title="Today's table availability">
          {isLoading ? (
            <Loader centered label="Memuat denah meja..." />
          ) : error ? (
            <EmptyState
              icon={<FiAlertTriangle size={22} />}
              title="Unable to load availability"
              description={error}
              actionLabel="Retry"
              onAction={refetch}
            />
          ) : (
            <FloorPlan tables={tables || []} disableReserved />
          )}
        </Card>

        <div className="member-dashboard__side">
          <Card title="Quick Actions">
            <div className="member-dashboard__quick-actions">
              <Button
                variant="primary"
                className="button--cta"
                icon={<FiPlus />}
                onClick={() => navigate("/reservation/reserve")}
              >
                Reserve Table
              </Button>
              <Button
                variant="secondary"
                className="button--cta"
                onClick={() => navigate("/reservation/history")}
              >
                Reservation History
              </Button>
            </div>
          </Card>

          <Card title="Today's Status" subtitle="Summary for Floor Plan Sector A">
            <div className="member-dashboard__stat-row">
              <span>
                <FiGrid size={14} /> Total Tables
              </span>
              <strong>{stats.total}</strong>
            </div>
            <div className="member-dashboard__stat-row">
              <span>
                <FiCheckSquare size={14} /> Available
              </span>
              <strong>{stats.available}</strong>
            </div>
            <div className="member-dashboard__stat-row">
              <span>
                <FiUsers size={14} /> Reserved
              </span>
              <strong>{stats.reserved}</strong>
            </div>

            <p className="member-dashboard__latest-title">Latest Reservations</p>

            {latestReserved.length > 0 ? (
              latestReserved.map((table) => (
                <div className="member-dashboard__activity" key={table.id}>
                  <span className="member-dashboard__activity-icon">
                    <FiClock size={14} />
                  </span>
                  <div>
                    <p className="table-cell__primary">Table {table.id} Booked</p>
                    <p className="table-cell__secondary">Reservation confirmed</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">Belum ada aktivitas reservasi terbaru.</p>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

export default MemberDashboard;