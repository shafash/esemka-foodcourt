import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
    getAllTables,
    getTableById,
    createTable,
    updateTable,
    deleteTable
} from "../controllers/table.controller.js";

const router = Router();

router.get(
    "/",
    authMiddleware,
    roleMiddleware(1, 2),
    getAllTables
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(1, 2),
    getTableById
);

router.post(
    "/",
    authMiddleware,
    roleMiddleware(1),
    createTable
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(1),
    updateTable
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(1),
    deleteTable
);

export default router;