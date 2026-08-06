import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
    getAllMenuIngredients,
    getMenuIngredientById,
    createMenuIngredient,
    updateMenuIngredient,
    deleteMenuIngredient
} from "../controllers/menuIngredient.controller.js";

const router = Router();

router.get(
    "/",
    authMiddleware,
    roleMiddleware(1),
    getAllMenuIngredients
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(1),
    getMenuIngredientById
);

router.post(
    "/",
    authMiddleware,
    roleMiddleware(1),
    createMenuIngredient
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(1),
    updateMenuIngredient
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(1),
    deleteMenuIngredient
);

export default router;