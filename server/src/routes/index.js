import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Esemka Foodcourt API",
    });
});

export default router;