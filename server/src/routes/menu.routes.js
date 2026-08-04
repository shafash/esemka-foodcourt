import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
    getAllMenus,
    getMenuById,
    createMenu,
    updateMenu,
    deleteMenu
} from "../controllers/menu.controller.js";

const router = Router();

router.get(
    "/",
    getAllMenus
);

router.get(
    "/:id",
    getMenuById 
);

router.post(
    "/",
    createMenu 
);

router.put(
    "/:id",
    updateMenu
);

router.delete(
    "/:id",
    deleteMenu 
);

export default router;