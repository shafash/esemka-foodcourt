import { Router } from "express";
import authRoutes from "./auth.routes.js";
import prisma from "../config/prisma.js";

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

export default router;