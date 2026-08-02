import { successResponse } from "../utils/response.js";
import { getAllCategoriesService,
    getCategoryByIdService,
    createCategoryService,
    updateCategoryService,
    deleteCategoryService
} from "../services/category.service.js";
import { categorySchema } from "../validations/category.validation.js";
import ApiError from "../errors/ApiError.js";

export const getAllCategories = async (
    req,
    res,
    next
) => {
    try {
        const categories = await getAllCategoriesService();

        return successResponse(
            res,
            "Categories retrieved successfully",
            categories
        );
    } catch (error) {
        next(error);
    }
};

export const getCategoryById = async (
    req,
    res,
    next
) => {

};

export const createCategory = async (
    req,
    res,
    next
) => {
    try {
        const payload = categorySchema.parse(
            req.body
        );

        const category = await createCategoryService(
            payload
        );

        return successResponse(
            res,
            "Category created successfully",
            category,
            201
        );
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (
    req,
    res,
    next
) => {
    try {
        const categoryId = Number(
            req.params.id
        );

        const payload = categorySchema.parse(
            req.body
        );

        const category = await updateCategoryService(
            categoryId,
            payload
        ); 

        return successResponse(
            res,
            "Category updated successfully",
            category
        );
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (
    req,
    res,
    next
) => {
    try {
        const categoryId = Number(
            req.params.id
        );

        if (Number.isNaN(categoryId)) {
            throw new ApiError(
                400,
                "Invalid category ID"
            );
        }

        await deleteCategoryService(
            categoryId
        );

        return successResponse(
            res,
            "Category deleted successfully"
        );
    } catch (error) {
        next(error);
    }
};