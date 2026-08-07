import { errorResponse, successResponse } from "../utils/response.js";
import {
    getAllIngredientsService,
    getIngredientByIdService,
    createIngredientService,
    updateIngredientService,
    deleteIngredientService
} from "../services/ingredient.service.js";
import {
    createIngredientSchema,
    updateIngredientSchema
} from "../validations/ingredient.validation.js";

export const getAllIngredients = async (
    req,
    res,
    next 
) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search?.trim() || "";
        const result = await getAllIngredientsService({
            page,
            limit,
            search 
        });

        return successResponse(
            res,
            "Ingredients retrieved successfully",
            result 
        );
    } catch (error) {
        next(error);
    }
};

export const getIngredientById = async (
    req,
    res,
    next 
) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return errorResponse(
                res,
                "Invalid ingreident ID",
                400
            );
        }

        const ingredient = await getIngredientByIdService(
            id 
        );

        return successResponse (
            res,
            "Ingredient retrieved successfully",
            ingredient 
        );
    } catch (error) {
        next(error);
    }
};

export const createIngredient = async (
    req,
    res,
    next 
) => {
    try {
        const payload = createIngredientSchema.parse(
            req.body 
        );

        const ingredient = await createIngredientService(
            payload 
        );

        return successResponse(
            res,
            "Ingredient created successfully",
            ingredient,
            201 
        );
    } catch (error) {
        next(error);
    }
};

export const updateIngredient = async (
    req,
    res,
    next 
) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return errorResponse(
                res,
                "Invalid ingredient ID",
                400 
            );
        }

        const payload = updateIngredientSchema.parse(
            req.body 
        );

        const ingredient = await updateIngredientService(
            id,
            payload 
        );

        return successResponse(
            res,
            "Ingredient updated successfully",
            ingredient 
        );
    } catch (error) {
        next(error);
    }
};

export const deleteIngredient = async (
    req,
    res,
    next 
) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return errorResponse(
                res,
                "Invalid ingredient ID",
                400 
            );
        }

        await deleteIngredientService(id);

        return successResponse(
            res,
            "Ingredient deleted successfully"
        );
    } catch (error) {
        next(error);
    }
};