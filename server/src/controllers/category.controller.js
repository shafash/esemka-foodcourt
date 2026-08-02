import { successResponse } from "../utils/response.js";
import { getAllCategoriesService,
    getCategoryByIdService,
    createCategoryService,
    updateCategoryService,
    deleteCategoryService
} from "../services/category.service.js";

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

};

export const updateCategory = async (
    req,
    res,
    next
) => {

};

export const deleteCategory = async (
    req,
    res,
    next
) => {

};