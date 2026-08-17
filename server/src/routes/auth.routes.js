import { Router } from "express";
import {
    register,
    login,
    logout,
    getMe,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = Router();

router.post(
    "/register",
    register 
);

router.post(
    "/login",
    login 
);

router.post(
    "/logout",
    authMiddleware,
    logout
);

router.get(
    "/profile",
    authMiddleware,
    getMe
);

router.get(
    "/admin",
    authMiddleware,
    roleMiddleware(1),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome, admin!",
        });
    }
);

export default router;