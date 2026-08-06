import { errorResponse, successResponse } from "../utils/response.js";
import ApiError from "../errors/ApiError.js";
import {
    getAllMenuIngredientsService,
    getMenuIngredientByIdService,
    createMenuIngredientService,
    updateMenuIngredientService,
    deleteMenuIngredientService
} from "../services/menuIngredient.service.js";
import {
    createMenuIngredientSchema,
    updateMenuIngredientSchema
} from "../validations/menuIngredient.validation.js";

export const getAllMenuIngredients = async (
    req,
    res,
    next 
) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search?.trim() || "";
        const result = await getAllMenuIngredientsService({
            page,
            limit,
            search 
        });

        return successResponse(
            res,
            "Menu ingredients retrieved successfully",
            result 
        );
    } catch (error) {
        next(error);
    }
};

export const getMenuIngredientById = async (
    req,
    res,
    next 
) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return errorResponse(
                res,
                "Invalid menu ingredient ID",
                400
            );
        }

        const menuIngredient = await getMenuIngredientByIdService(
            id 
        );

        return successResponse(
            res,
            "Menu ingredient retrieved successfully",
            menuIngredient 
        );
    } catch (error) {
        next(error);
    }
};

export const createMenuIngredient = async(
    req,
    res,
    next 
) => {
    try {
        const payload = createMenuIngredientSchema.parse(
            req.body 
        );

        const menuIngredient = await createMenuIngredientService(
            payload 
        );

        return successResponse(
            res,
            "Menu ingredient created successfully",
            menuIngredient,
            201 
        );
    } catch (error) {
        next(error);
    }
};

export const updateMenuIngredient = async (
    req,
    res,
    next 
) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return errorResponse(
                res,
                "Invalid menu ingredient ID", 
                400
            );
        }

        const payload = updateMenuIngredientSchema.parse(
            req.body 
        );

        const menuIngredient = await updateMenuIngredientService(
            id,
            payload 
        );

        return successResponse(
            res,
            "Menu ingredient updated successfully",
            menuIngredient 
        );
    } catch (error) {
        next(error);
    }
};

export const deleteMenuIngredient = async (
    req,
    res,
    next 
) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return errorResponse(
                res,
                "Invalid menu ingredient ID",
                400 
            );
        }

        await deleteMenuIngredientService(id);

        return successResponse(
            res,
            "Menu ingredient deleted successfully"
        );
    } catch (error){
        next(error);
    }
};