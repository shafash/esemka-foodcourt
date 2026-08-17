import { CSRF_COOKIE_NAME } from "../utils/cookies.js";

const PROTECTED_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

// Endpoints that legitimately have no session/CSRF cookie yet (the user
// isn't authenticated at the point they call these). Paths are relative to
// the /api mount point (see app.js: app.use("/api", csrfMiddleware, routes)).
const EXEMPT_PATHS = ["/auth/login", "/auth/register"];

const csrfMiddleware = (req, res, next) => {
    if (!PROTECTED_METHODS.includes(req.method)) {
        return next();
    }

    if (EXEMPT_PATHS.includes(req.path)) {
        return next();
    }

    const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
    const headerToken = req.headers["x-csrf-token"];

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
        return res.status(403).json({
            success: false,
            message: "Invalid or missing CSRF token",
        });
    }

    return next();
};

export default csrfMiddleware;