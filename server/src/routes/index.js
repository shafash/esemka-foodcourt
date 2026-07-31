import { Router } from "express";
import authRoutes from "./auth.routes.js";
import prisma from "../config/prisma.js";
import userRoutes from "./user.routes.js";

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

export default router;