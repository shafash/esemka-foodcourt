import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
    getAllReservations,
    getReservationById,
    getMyReservationById,
    getMyReservations,
    createReservation,
    updateReservation,
    deleteReservation,
    cancelReservation
} from "../controllers/reservation.controller.js";

const router = Router();

router.get(
    "/",
    getAllReservations 
);

router.get(
    "/:id",
    getReservationById 
);

router.put(
    "/:id",
    updateReservation
);

router.delete(
    "/:id",
    deleteReservation
);

router.post(
    "/",
    authMiddleware,
    roleMiddleware(2),
    createReservation 
);

router.get(
    "/me",
    authMiddleware,
    roleMiddleware(2),
    getMyReservations
);

router.get(
    "/me/:id",
    authMiddleware,
    roleMiddleware(2),
    getMyReservationById
);

router.put(
    "/me/:id/cancel",
    authMiddleware,
    roleMiddleware(2),
    cancelReservation
);

export default router;