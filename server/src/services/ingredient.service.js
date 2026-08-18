import prisma from "../config/prisma.js";
import ApiError from "../errors/ApiError.js";

export const getAllIngredientsService = async ({ page, limit, search }) => {
    const skip = (page - 1) * limit;
    const where = search ? {
        Name: {
            contains: search
        }
    } : {};

    const totalData = await prisma.ingredients.count({ where });
    const data = await prisma.ingredients.findMany({
        where,
        skip,
        take: limit,
        orderBy: { ID: "asc" }
    });

    return {
        ingredients: data,
        pagination: {
            page,
            limit,
            totalData,
            totalPages: Math.ceil(totalData / limit)
        }
    };
};

export const getIngredientByIdService = async (id) => {
    const ingredient = await prisma.ingredients.findUnique({
        where: { ID: id }
    });
    if (!ingredient) {
        throw new ApiError(404, "Ingredient not found");
    }
    return ingredient;
};

export const createIngredientService = async (payload) => {
    const { Name } = payload;
    const existing = await prisma.ingredients.findFirst({
        where: { Name: { equals: Name } }
    });
    if (existing) {
        throw new ApiError(409, "Ingredient already exists");
    }
    const ingredient = await prisma.ingredients.create({
        data: { Name }
    });
    return ingredient;
};

export const updateIngredientService = async (id, payload) => {
    const { Name } = payload;
    const existing = await prisma.ingredients.findUnique({
        where: { ID: id }
    });
    if (!existing) {
        throw new ApiError(404, "Ingredient not found");
    }
    const duplicate = await prisma.ingredients.findFirst({
        where: {
            Name: { equals: Name },
            NOT: { ID: id }
        }
    });
    if (duplicate) {
        throw new ApiError(409, "Ingredient name already exists");
    }
    const updated = await prisma.ingredients.update({
        where: { ID: id },
        data: { Name }
    });
    return updated;
};

export const deleteIngredientService = async (id) => {
    const existing = await prisma.ingredients.findUnique({
        where: { ID: id }
    });
    if (!existing) {
        throw new ApiError(404, "Ingredient not found");
    }
    const usageCount = await prisma.menuIngredients.count({
        where: { IngredientID: id }
    });
    if (usageCount > 0) {
        throw new ApiError(409, "Ingredient is still used by one or more menus and cannot be deleted");
    }
    await prisma.ingredients.delete({
        where: { ID: id }
    });
};