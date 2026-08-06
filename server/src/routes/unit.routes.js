import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
    getAllUnits,
    getUnitById,
    createUnit,
    updateUnit,
    deleteUnit
} from "../controllers/unit.controller.js";

const router = Router();

router.get(
    "/",
    authMiddleware,
    roleMiddleware(1),
    getAllUnits
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(1),
    getUnitById
);

router.post(
    "/",
    authMiddleware,
    roleMiddleware(1),
    createUnit
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(1),
    updateUnit
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(1),
    deleteUnit
);

export default router;