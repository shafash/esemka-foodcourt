import { useCallback, useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";

import Header from "../../components/layout/Header";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import FloorPlan from "../../components/reservation/FloorPlan";
import ReservationDetail from "./ReservationDetail";

import useFetch from "../../hooks/useFetch";
import {
  getTables,
  getReservationByTable,
  confirmReservation,
  cancelReservation,
  completeReservation,
} from "../../services/reservation.service";

import "../../styles/reservation.css";

function ReservationList() {
  // getTables() with no date defaults to "today" on the backend.
  const fetchTables = useCallback(() => getTables(), []);
  const {
    data: tables,
    isLoading: isTablesLoading,
    error: tablesError,
    refetch: refetchTables,
  } = useFetch(fetchTables);

  const [selectedTable, setSelectedTable] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchDetail = useCallback(
    () => (selectedTable ? getReservationByTable(selectedTable) : Promise.resolve(null)),
    [selectedTable]
  );
  const { data: reservation, isLoading: isDetailLoading, refetch: refetchDetail } =
    useFetch(fetchDetail);

  const handleSelectTable = (table) => {
    setSelectedTable(table);
  };

  const handleConfirm = async (target) => {
    setIsUpdating(true);
    try {
      await confirmReservation(target.id);
      await Promise.all([refetchDetail(), refetchTables()]);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = async (target) => {
    setIsUpdating(true);
    try {
      await cancelReservation(target.id);
      await Promise.all([refetchDetail(), refetchTables()]);
      setSelectedTable(null);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleComplete = async (target) => {
    setIsUpdating(true);
    try {
      await completeReservation(target.id);
      await Promise.all([refetchDetail(), refetchTables()]);
      setSelectedTable(null);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Header title="Reservation" />

      <div className="reservation-page">
        <Card noPadding className="reserve-page__floor">
          {isTablesLoading ? (
            <Loader centered label="Memuat denah meja..." />
          ) : tablesError ? (
            <EmptyState
              icon={<FiAlertTriangle size={22} />}
              title="Unable to load availability"
              description={tablesError}
              actionLabel="Retry"
              onAction={refetchTables}
            />
          ) : (
            <FloorPlan
              tables={tables || []}
              selectedId={selectedTable?.id}
              onSelect={handleSelectTable}
              disableReserved={false}
            />
          )}
        </Card>

        <div
          className={`reservation-detail__backdrop${
            selectedTable ? " reservation-detail__backdrop--visible" : ""
          }`}
          onClick={() => setSelectedTable(null)}
        />

        <ReservationDetail
          table={selectedTable}
          reservation={reservation}
          isLoading={isDetailLoading}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onComplete={handleComplete}
          onClose={() => setSelectedTable(null)}
          isUpdating={isUpdating}
        />
      </div>
    </>
  );
}

export default ReservationList;