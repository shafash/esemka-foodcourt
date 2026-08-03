import { successResponse } from "../utils/response.js";
import { 
    getAllMembersService,
    getMemberByIdService,
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

export const getMemberById = async (
    req,
    res,
    next 
) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return errorResponse(
                res,
                "Invalid member ID",
                400
            );
        }

        const member = await getMemberByIdService(id);

        return successResponse(
            res,
            "Member retrivied successfully",
            member
        );
    } catch (error) {
        next(error);
    }
};