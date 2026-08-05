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
    getAllMenuIngredients 
);

router.get(
    "/:id",
    getMenuIngredientById
);

router.post(
    "/",
    createMenuIngredient 
);

router.put(
    "/:id",
    updateMenuIngredient 
);

router.delete(
    "/:id",
    deleteMenuIngredient
);

export default router;