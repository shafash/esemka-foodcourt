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
    authMiddleware,
    roleMiddleware(1),
    getAllReservations 
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

router.post(
    "/",
    authMiddleware,
    roleMiddleware(2),
    createReservation 
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(1),
    getReservationById 
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(1),
    updateReservation
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(1),
    deleteReservation
);

export default router;