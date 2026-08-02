import prisma from "../config/prisma.js";
import ApiError from "../errors/ApiError.js";

export const getAllCategoriesService = async () => {
    const categories = await prisma.categories.findMany({
        orderBy: {
            Name: "asc"
        }
    });

    return categories;
};

export const getCategoryByIdService = async (categoryId) => {

};

export const createCategoryService = async (payload) => {
    const existingCategory = await prisma.categories.findFirst({
        where: {
            Name: payload.Name 
        }
    });

    if (existingCategory) {
        throw new ApiError(
            409,
            "Category already exists"
        );
    }

    const category = await prisma.categories.create({
        data: {
            Name: payload.Name 
        }
    });

    return category;
};

export const updateCategoryService = async (categoryId, payload) => {   

};

export const deleteCategoryService = async (categoryId) => {

};