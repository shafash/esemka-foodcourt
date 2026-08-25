import ApiError from "../errors/ApiError.js";
import { ZodError } from "zod";
import multer from "multer";

const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    if (err instanceof multer.MulterError) {
        const message = err.code === "LIMIT_FILE_SIZE"
            ? "Ukuran file maksimal 2MB. Silakan pilih foto dengan ukuran lebih kecil."
            : "Gagal mengunggah file. Silakan coba lagi.";
        return res.status(400).json({
            success: false,
            message,
        });
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Data yang dikirim tidak valid",
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