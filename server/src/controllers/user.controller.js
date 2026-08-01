import { successResponse } from "../utils/response.js";
import { 
    getProfileService, 
    updateProfileService,
    changePasswordService
} from "../services/user.service.js";
import { 
    updateProfileSchema,
    changePasswordSchema
} from "../validations/user.validation.js";

export const getProfile = async (
    req, 
    res,
    next 
) => {
    try {
        const profile = await getProfileService(
            req.user.ID 
        );

        return successResponse(
            res,
            "Profile retrieved successfully",
            profile 
        );
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (
    req, 
    res,
    next 
) => {
    try {
        const payload = updateProfileSchema.parse(
            req.body
        );

        const user = await updateProfileService(
            req.user.ID,
            payload
        );

        return successResponse(
            res,
            "Profile updated successfully",
            user 
        );
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (
    req, 
    res, 
    next 
) => {
    try {
        const payload = changePasswordSchema.parse(
            req.body
        );

        await changePasswordService(
            req.user.ID,
            payload 
        );

        return successResponse(
            res,
            "Password changed successfully"
        );
    } catch (error) {
        next(error);
    }
};