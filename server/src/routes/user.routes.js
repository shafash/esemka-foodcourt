import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
    getProfile,
    updateProfile,
    changePassword,
} from "../controllers/user.controller.js";

const router = Router();

router.use(authMiddleware);

router.get(
    "/me",
    getProfile 
);

router.put(
    "/profile",
    updateProfile
);

router.put(
    "/change-password",
    changePassword 
);

export default router;