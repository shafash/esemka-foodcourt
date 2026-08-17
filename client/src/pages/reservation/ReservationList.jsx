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
  const [selectedTable, setSelectedTable] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchDetail = useCallback(
    () => {
      if (!selectedTable?.reservationId) {
        return Promise.resolve(null);
      }

      return getReservationByTable(selectedTable);
    },
    [selectedTable]
  );

  const {
    data: reservation,
    isLoading: isDetailLoading,
    refetch: refetchDetail,
  } = useFetch(fetchDetail);

  /*
   * DENAH MEJA
   *
   * Backend akan menentukan meja mana yang reserved
   * berdasarkan reservation aktif pada hari ini.
   *
   * Tidak bergantung kepada meja yang sedang dipilih.
   */
  const fetchTables = useCallback(
    () => getTables(),
    []
  );

  const {
    data: tables,
    isLoading: isTablesLoading,
    error: tablesError,
    refetch: refetchTables,
  } = useFetch(fetchTables);

  const handleSelectTable = (table) => {
    setSelectedTable(table);
  };

  /*
   * CONFIRM
   *
   * Pending -> Confirmed
   * kemudian refresh denah.
   *
   * Backend akan membaca reservation yang baru menjadi
   * Confirmed dan mengembalikan meja tersebut sebagai reserved.
   */
  const handleConfirm = async (target) => {
    if (!target?.id) return;

    setIsUpdating(true);

    try {
      await confirmReservation(target.id);

      /*
       * Ambil ulang detail reservation.
       */
      await refetchDetail();

      /*
       * Ambil ulang seluruh denah meja.
       *
       * Ini yang membuat status meja berubah:
       * available -> reserved
       */
      await refetchTables();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = async (target) => {
    if (!target?.id) return;

    setIsUpdating(true);

    try {
      await cancelReservation(target.id);

      /*
       * Reservation menjadi Cancelled,
       * sehingga backend tidak lagi memasukkannya
       * ke ACTIVE_RESERVATION_STATUSES.
       */
      await refetchDetail();
      await refetchTables();

      setSelectedTable(null);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleComplete = async (target) => {
    if (!target?.id) return;

    setIsUpdating(true);

    try {
      await completeReservation(target.id);

      /*
       * Completed bukan ACTIVE reservation,
       * sehingga meja kembali available.
       */
      await refetchDetail();
      await refetchTables();

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
            <Loader
              centered
              label="Memuat denah meja..."
            />
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
            selectedTable
              ? " reservation-detail__backdrop--visible"
              : ""
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