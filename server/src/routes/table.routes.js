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
    getAllTables 
);

router.get(
    "/:id",
    getTableById
);

router.post(
    "/",
    createTable 
);

router.put(
    "/:id",
    updateTable 
);

router.delete(
    "/:id",
    deleteTable
);

export default router;