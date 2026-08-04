import prisma from "../config/prisma.js";
import ApiError from "../errors/ApiError.js";

export const getAllIngredientsService = async ({
    page,
    limit,
    search
}) => {
    const skip = (page - 1) * limit;

    const where = {
        ...(search && {
            Name: {
                contains: search 
            }
        })
    };

    const totalData = await prisma.ingredients.count({
        where 
    });

    const ingredients = await prisma.ingredients.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
            Name: "asc"
        }
    });

    return {
        ingredients,
        pagination: {
            page,
            limit,
            totalData,
            totalPages: Math.ceil(totalData / limit)
        }
    };
};

export const getIngredientByIdService = async (
    id 
) => {
    const ingredient = await prisma.ingredients.findUnique({
        where: {
            ID: id 
        }
    });

    if (!ingredient) {
        throw new ApiError(
            404,
            "Ingredient not found"
        );
    }

    return {
        ID: ingredient.ID,
        Name: ingredient.Name 
    };
};

export const createIngredientService = async (
    payload 
) => {
    const ingredient = await prisma.ingredients.create({
        data: {
            Name: payload.Name 
        }
    });

    return {
        ID: ingredient.ID,
        Name: ingredient.Name 
    };
};

export const updateIngredientService = async (
    id,
    payload
) => {

    const ingredient = await prisma.ingredients.findUnique({
        where: {
            ID: id
        }
    });

    if (!ingredient) {
        throw new ApiError(
            404,
            "Ingredient not found"
        );
    }

    const updatedIngredient = await prisma.ingredients.update({
        where: {
            ID: id
        },

        data: {
            Name: payload.Name
        }
    });

    return {
        ID: updatedIngredient.ID,
        Name: updatedIngredient.Name
    };
};

export const deleteIngredientService = async (
    id
) => {

    const ingredient = await prisma.ingredients.findUnique({
        where: {
            ID: id
        }
    });

    if (!ingredient) {
        throw new ApiError(
            404,
            "Ingredient not found"
        );
    }

    const menuIngredientCount = await prisma.menuIngredients.count({
        where: {
            IngredientID: id
        }
    });

    if (menuIngredientCount > 0) {
        throw new ApiError(
            409,
            "Ingredient cannot be deleted because it is used in menu ingredients"
        );
    }

    await prisma.ingredients.delete({
        where: {
            ID: id
        }
    });
};