import {
    registerSchema,
    loginSchema,
} from "../validations/auth.validation.js";

import {
    registerService,
    loginService,
} from "../services/auth.service.js";

import { successResponse } from "../utils/response.js";

export const register = async (req, res, next) => {
    try {
        const payload = registerSchema.parse(req.body);
        const user = await registerService(payload);

        return successResponse(
            res,
            "User registered successfully",
            {
                ID: user.ID,
                FirstName: user.FirstName,
                LastName: user.LastName,
                Email: user.Email,
                PhoneNumber: user.PhoneNumber,
                RoleID: user.RoleID,
                DateJoined: user.DateJoined,
            },
            201
        );
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const payload = loginSchema.parse(req.body);
        const result = await loginService(payload);

        return successResponse(res, "Login successful", {
            token: result.token,
            user: {
                ID: result.user.ID,
                FirstName: result.user.FirstName,
                LastName: result.user.LastName,
                Email: result.user.Email,
                PhoneNumber: result.user.PhoneNumber,
                RoleID: result.user.RoleID,
                DateJoined: result.user.DateJoined,
            },
        });
    } catch (error) {
        next(error);
    }
};