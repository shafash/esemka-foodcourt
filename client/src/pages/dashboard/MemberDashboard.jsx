import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiClock, FiGrid, FiCheckSquare, FiUsers } from "react-icons/fi";

import Header from "../../components/layout/Header";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import FloorPlan from "../../components/reservation/FloorPlan";

import useAuth from "../../hooks/useAuth";
import useFetch from "../../hooks/useFetch";
import { getTables } from "../../services/reservation.service";

import "../../styles/reservation.css";

function MemberDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: tables, isLoading } = useFetch(getTables);

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
      <Header
        title="Reservation Dashboard"
        subtitle={`Welcome back, ${user?.firstName || "Guest"}. Manage your table bookings and floor plan.`}
        actions={
          <>
            <Button variant="secondary" onClick={() => navigate("/reservation/history")}>
              History
            </Button>
            <Button
              variant="primary"
              icon={<FiPlus />}
              onClick={() => navigate("/reservation/reserve")}
            >
              New Reservation
            </Button>
          </>
        }
      />

      <div className="member-dashboard">
        <Card noPadding title="Floor Plan - Sector A">
          {isLoading ? (
            <Loader centered label="Memuat denah meja..." />
          ) : (
            <FloorPlan tables={tables || []} disableReserved />
          )}
        </Card>

        <div className="member-dashboard__side">
          <Card title="Today's Status" subtitle="Sector A Overview">
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
          </Card>

          <Card title="Latest Activity">
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
