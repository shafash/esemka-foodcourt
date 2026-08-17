import jwt from "jsonwebtoken";
import { AUTH_COOKIE_NAME } from "../utils/cookies.js";

const authMiddleware = (
    req, 
    res,
    next 
) => {
    const token = req.cookies?.[AUTH_COOKIE_NAME];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token is required",
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};

export default authMiddleware;