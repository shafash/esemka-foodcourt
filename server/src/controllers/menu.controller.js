import { errorResponse, successResponse } from "../utils/response.js";
import ApiError from "../errors/ApiError.js";
import { 
    getAllMenusService,
    getMenuByIdService,
    createMenuService,
    updateMenuService,
    deleteMenuService
} from "../services/menu.service.js";
import {
    createMenuSchema,
    updateMenuSchema
} from "../validations/menu.validation.js";

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

export const createMenu = async (
    req,
    res,
    next 
) => {
    try {
        const payload = createMenuSchema.parse(
            req.body 
        );

        if (req.file) {
            payload.Image = req.file.filename;
        }

        const menu = await createMenuService(
            payload 
        );

        return successResponse(
            res,
            "Menu created successfully",
            menu,
            201 
        );
    } catch (error) {
        next(error);
    }
};

export const updateMenu = async (
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

        const payload = updateMenuSchema.parse(
            req.body 
        );

        if (req.file) {
            payload.Image = req.file.filename;
        }

        const menu = await updateMenuService(
            id,
            payload 
        );

        return successResponse(
            res,
            "Menu updated successfully",
            menu 
        );
    } catch (error) {
        next(error);
    }
};

export const deleteMenu = async (
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

        await deleteMenuService(id);

        return successResponse(
            res,
            "Menu deleted successfully"
        );
    } catch (error) {
        next(error);
    }
};