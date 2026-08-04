import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import {
    getAllMenus,
    getMenuById 
} from "../controllers/menu.controller.js";

const router = Router();

router.get(
    "/",
    getAllMenus
);

router.get(
    "/:id",
    getMenuById 
);