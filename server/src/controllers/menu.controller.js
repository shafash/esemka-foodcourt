import { errorResponse, successResponse } from "../utils/response.js";
import { ApiError } from "../errors/ApiError.js";
import { 
    getAllMenusService,
    getMenuByIdService
} from "../services/menu.service.js";

export const getAllMenus = async (
    req,
    res,
    next 
) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search?.trim() || "";
        const result = await getAllMenusService({
            page,
            limit,
            search 
        });

        return successResponse(
            res,
            "Menus retrieved successfully",
            result 
        );
    } catch (error) {
        next(error);
    }
};

export const getMenuById = async (
    req,
    res,
    next 
) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return errorResponse(
                res,
                "Invalid menu ID",
                400 
            );
        }

        const menu = await getMenuByIdService(id);

        return successResponse(
            res,
            "Menu retrieved successfully",
            menu 
        );
    } catch (error) {
        next(error);
    }
};