import { successResponse } from "../utils/response.js";
import { getProfileService } from "../services/user.service.js";

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

};

export const changePassword = async (
    req, 
    res, 
    next 
) => {

};