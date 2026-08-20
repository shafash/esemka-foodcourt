import prisma from "../config/prisma.js";
import ApiError from "../errors/ApiError.js";

export const getAllCategoriesService = async () => {
    const categories = await prisma.categories.findMany({
        orderBy: { Name: "asc" },
        include: {
            _count: {
                select: {
                    Menus: { where: { DeletedAt: null } }
                }
            }
        }
    });

    return categories.map(category => ({
        ID: category.ID,
        Name: category.Name,
        MenuCount: category._count.Menus
    }));
};

export const getCategoryByIdService = async (categoryId) => {
    const category = await prisma.categories.findFirst({
        where: {
            ID: categoryId
        },
        include: {
            Menus: {
                where: {
                    DeletedAt: null
                },
                select: {
                    ID: true,
                    Name: true,
                    Description: true,
                    Price: true,
                    Image: true
                }
            }
        }
    });

    if (!category) {
        throw new ApiError(
            404,
            "Category not found"
        );
    }

    return {
        ID: category.ID,
        Name: category.Name,
        Menus: category.Menus.map(menu => ({
            ID: menu.ID,
            Name: menu.Name,
            Description: menu.Description,
            Price: menu.Price,
            Image: menu.Image
        }))
    };
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
    const category = await prisma.categories.findFirst({
        where: {
            ID: categoryId
        }
    });

    if (!category) {
        throw new ApiError(
            404,
            "Category not found"
        );
    }

    const existingCategory = await prisma.categories.findFirst({
        where: {
            Name: payload.Name,
            NOT: {
                ID: categoryId
            }
        }
    });

    if (existingCategory) {
        throw new ApiError(
            409,
            "Category name already exists"
        );
    }

    const updatedCategory = await prisma.categories.update({
        where: {
            ID: categoryId
        },

        data: {
            Name: payload.Name
        }
    });

    return updatedCategory;
};

export const deleteCategoryService = async (categoryId) => {
    const category = await prisma.categories.findFirst({
        where: {
            ID: categoryId
        }
    });

    if (!category) {
        throw new ApiError(
            404,
            "Category not found"
        );
    }

    const menuCount = await prisma.menus.count({
        where: {
            CategoryID: categoryId,
            DeletedAt: null
        }
    });

    if (menuCount > 0) {
        throw new ApiError(
            409,
            "Category cannot be deleted because it is associated with existing menu items"
        );
    }

    await prisma.categories.delete({
        where: {
            ID: categoryId
        }
    });
};