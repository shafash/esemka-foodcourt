import prisma from "../config/prisma.js";

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

};

export const updateCategoryService = async (categoryId, payload) => {   

};

export const deleteCategoryService = async (categoryId) => {

};