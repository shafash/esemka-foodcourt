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
    getAllCategories 
);

router.get(
    "/:id",
    getCategoryById
);

router.post(
    "/",
    createCategory
);

router.put(
    ":id",
    updateCategory
);

router.delete(
    "/:id",
    deleteCategory
);

export default router;