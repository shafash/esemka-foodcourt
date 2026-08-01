import { successResponse } from "../utils/response.js";
import { 
    getProfileService, 
    updateProfileService
} from "../services/user.service.js";
import { updateProfileSchema } from "../validations/user.validation.js";

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

};