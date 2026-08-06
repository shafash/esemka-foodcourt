import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import uploadMiddleware from "../middleware/upload.middleware.js";
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
    authMiddleware,
    roleMiddleware(1),
    getAllMenus
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(1),
    getMenuById
);

router.post(
    "/",
    authMiddleware,
    roleMiddleware(1),
    uploadMiddleware.single("image"),
    createMenu
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(1),
    uploadMiddleware.single("image"),
    updateMenu
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(1),
    deleteMenu
);

export default router;