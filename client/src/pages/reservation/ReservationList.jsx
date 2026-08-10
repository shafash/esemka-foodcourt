import { useCallback, useState } from "react";

import Header from "../../components/layout/Header";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import FloorPlan from "../../components/reservation/FloorPlan";
import ReservationDetail from "./ReservationDetail";

import useFetch from "../../hooks/useFetch";
import {
  getTables,
  getReservationByTable,
  confirmReservation,
  cancelReservation,
} from "../../services/reservation.service";

import "../../styles/reservation.css";

function ReservationList() {
  const { data: tables, isLoading: isTablesLoading, refetch: refetchTables } = useFetch(getTables);

  const [selectedTable, setSelectedTable] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchDetail = useCallback(
    () => (selectedTable ? getReservationByTable(selectedTable.id) : Promise.resolve(null)),
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

  return (
    <>
      <Header title="Reservation" />

      <div className="reservation-page">
        <Card noPadding className="reserve-page__floor">
          {isTablesLoading ? (
            <Loader centered label="Memuat denah meja..." />
          ) : (
            <FloorPlan
              tables={tables || []}
              selectedId={selectedTable?.id}
              onSelect={handleSelectTable}
              disableReserved={false}
            />
          )}
        </Card>

        <ReservationDetail
          table={selectedTable}
          reservation={reservation}
          isLoading={isDetailLoading}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          isUpdating={isUpdating}
        />
      </div>
    </>
  );
}

export default ReservationList;
