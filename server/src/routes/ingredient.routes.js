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
    getAllIngredients 
);

router.get(
    "/:id",
    getIngredientById 
);

router.post(
    "/",
    createIngredient 
);

router.put(
    "/:id",
    updateIngredient,
);

router.delete(
    "/:id",
    deleteIngredient 
);

export default router;