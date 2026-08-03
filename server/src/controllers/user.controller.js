import { successResponse } from "../utils/response.js";
import { 
    getAllMembersService,
} from "../services/user.service.js";

export const getAllMembers = async (
    req,
    res,
    next 
) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search?.trim() || "";
        const result = await getAllMembersService({
            page,
            limit,
            search,
        });

        return successResponse(
            res,
            "Members retrieved successfully",
            result
        );
    } catch (error) {
        next(error);
    }
};