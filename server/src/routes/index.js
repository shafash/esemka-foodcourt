import { Router } from "express";
import authRoutes from "./auth.routes.js";
import prisma from "../config/prisma.js";
import userRoutes from "./user.routes.js";
import categoryRoutes from "./category.routes.js";
import menuRoutes from "./menu.routes.js";
import ingredientRoutes from "./ingredient.routes.js";
import unitRoutes from "./unit.routes.js";
import menuIngredientRoutes from "./menuIngredient.routes.js";
import tableRoutes from "./table.routes.js";
import reservationRoutes from "./reservation.routes.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const tables = await prisma.$queryRawUnsafe("SHOW TABLES");

        res.json({
            success: true,
            message: "Esemka Foodcourt API",
            totalTable: tables.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.use(
    "/auth",
    authRoutes
);

router.get("/test-error", (req, res, next) => {
    next(new Error("Testing internal server error"));
});

router.use(
    "/users",
    userRoutes
);

router.use(
    "/categories",
    categoryRoutes
);

router.use(
    "/menus",
    menuRoutes 
);

router.use(
    "/ingredients",
    ingredientRoutes
);

router.use(
    "/units",
    unitRoutes
);

router.use(
    "/menuIngredients",
    menuIngredientRoutes 
);

router.use(
    "/tables",
    tableRoutes 
);

router.use(
    "/reservations",
    reservationRoutes
);

export default router;