import {
    registerSchema,
    loginSchema,
} from "../validations/auth.validation.js";

import {
    registerService,
    loginService,
    getMeService,
} from "../services/auth.service.js";

import { successResponse } from "../utils/response.js";
import { setAuthCookies, clearAuthCookies } from "../utils/cookies.js";

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

        setAuthCookies(res, {
            token: result.token,
            csrfToken: result.csrfToken,
        });

        // The JWT itself is intentionally NOT included in the response body
        // anymore - it only ever lives in the httpOnly cookie, so it's
        // never reachable from JS (mitigates token theft via XSS).
        return successResponse(res, "Login successful", {
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

export const logout = async (req, res, next) => {
    try {
        clearAuthCookies(res);
        return successResponse(res, "Logout successful", null);
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req, res, next) => {
    try {
        const user = await getMeService(req.user.ID);

        return successResponse(res, "Session valid", {
            ID: user.ID,
            FirstName: user.FirstName,
            LastName: user.LastName,
            Email: user.Email,
            PhoneNumber: user.PhoneNumber,
            RoleID: user.RoleID,
            DateJoined: user.DateJoined,
        });
    } catch (error) {
        next(error);
    }
};