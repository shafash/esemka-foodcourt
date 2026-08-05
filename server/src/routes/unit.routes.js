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
    getAllUnits 
);

router.get(
    "/:id",
    getUnitById 
);

router.post(
    "/",
    createUnit 
);

router.put(
    "/:id",
    updateUnit 
);

router.delete(
    "/:id",
    deleteUnit 
);

export default router;