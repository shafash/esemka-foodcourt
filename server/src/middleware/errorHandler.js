import ApiError from "../errors/ApiError.js";
import { ZodError } from "zod";

const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation Error",
            errors: (err.issues ?? err.errors ?? []).map(e => ({
                field: e.path.join("."),
                message: e.message 
            }))
        });
    }

    console.error(err);

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};

export default errorHandler;