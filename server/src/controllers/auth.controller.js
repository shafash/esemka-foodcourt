import { registerSchema } from "../validations/auth.validation.js";
import { registerService } from "../services/auth.service.js";
import { loginService } from "../services/auth.service.js";
import { loginSchema } from "../validations/auth.validation.js";

export const register = async (req, res) => {
    try {
        const payload = registerSchema.parse(req.body);
        const user = await registerService(payload);
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                ID: user.ID,
                FirstName: user.FirstName,
                LastName: user.LastName,
                Email: user.Email,
            }
        });
    }  catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        const payload = loginSchema.parse(req.body);
        const result = await loginService(payload);
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token: result.token,
            data: {
                ID: result.user.ID,
                FirstName: result.user.FirstName,
                LastName: result.user.LastName,
                Email: result.user.Email,
                RoleID: result.user.RoleID,
            }
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};