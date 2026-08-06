import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
    getAllIngredients,
    getIngredientById,
    createIngredient,
    updateIngredient,
    deleteIngredient
} from "../controllers/ingredient.controller.js";

const router = Router();

router.get(
    "/",
    authMiddleware,
    roleMiddleware(1),
    getAllIngredients
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(1),
    getIngredientById
);

router.post(
    "/",
    authMiddleware,
    roleMiddleware(1),
    createIngredient
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(1),
    updateIngredient
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(1),
    deleteIngredient
);

export default router;