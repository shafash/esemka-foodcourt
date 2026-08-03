import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
    getAllMembers,
    getMemberById
} from "../controllers/user.controller.js";

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(1));

router.get(
    "/",
    getAllMembers
);

router.get(
    "/:id",
    getMemberById 
);

export default router;