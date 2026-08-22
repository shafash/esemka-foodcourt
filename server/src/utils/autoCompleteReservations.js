import prisma from "../config/prisma.js";
import {
    ACTIVE_RESERVATION_STATUSES,
    RESERVATION_SESSION_HOURS
} from "./reservationStatus.js";

export const autoCompleteExpiredReservations = async () => {
    const now = new Date();

    const candidates = await prisma.reservations.findMany({
        where: {
            Status: { in: ACTIVE_RESERVATION_STATUSES },
            ReservationDate: { lte: now }
        },
        select: { ID: true, ReservationDate: true, ReservationTime: true }
    });

    const expiredIds = candidates
        .filter((r) => {
            const [hour, minute] = r.ReservationTime.split(":").map(Number);
            const sessionEnd = new Date(r.ReservationDate);
            sessionEnd.setHours(hour + RESERVATION_SESSION_HOURS, minute, 0, 0);
            return sessionEnd <= now;
        })
        .map((r) => r.ID);

    if (expiredIds.length === 0) return;

    await prisma.reservations.updateMany({
        where: { ID: { in: expiredIds } },
        data: { Status: "Completed" }
    });
};