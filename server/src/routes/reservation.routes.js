import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
    getAllReservations,
    getReservationById,
    updateReservation,
    deleteReservation
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

export default router;