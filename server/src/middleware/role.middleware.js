const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const hasRole = allowedRoles.some(role => {
            if (typeof role === "number") {
                return req.user.role === role; 
            }

            return req.user.roleName === role;
        });

        if (!hasRole) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Insufficient permissions",
            });
        }
        next();
    };
};

export default roleMiddleware;