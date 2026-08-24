import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import Header from "../../components/layout/Header";
import ReservationForm from "../../components/reservation/ReservationForm";
import { createReservation } from "../../services/reservation.service";

import "../../styles/reservation.css";

function CreateReservation() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      await createReservation(payload);
      navigate("/reservation/history");
    } catch (err) {
      toast.error(err.message || "Gagal membuat reservasi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header title="New Reservation" />
      <ReservationForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </>
  );
}

export default CreateReservation;
