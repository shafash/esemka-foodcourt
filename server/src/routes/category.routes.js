import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controllers/category.controller.js";

const router = Router();

router.get(
    "/",
    authMiddleware,
    getAllCategories 
);

router.get(
    "/:id",
    authMiddleware,
    getCategoryById
);

router.post(
    "/",
    authMiddleware,
    roleMiddleware(1),
    createCategory
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(1),
    updateCategory
);

router.delete(
    "/:id",
    deleteCategory
);

export default router;