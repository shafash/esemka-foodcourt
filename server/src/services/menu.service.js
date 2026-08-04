import prisma from "../config/prisma.js";
import ApiError from "../errors/ApiError.js";

export const getAllMenusService = async ({
    page,
    limit,
    search
}) => {
    const skip = (page - 1) * limit;

    const where = {
        ...(search && {
            Name: {
                constains: search 
            }
        })
    };

    const totalData = await prisma.menus.count({
        where 
    });

    const menus = await prisma.menus.findMany({
        where,
        skip,
        take: limit, 
        orderBy: {
            Name:  "asc"
        },
        include: {
            Category: {
                select: {
                    Id: true,
                    Name: true 
                }
            }
        }
    });

    return {
        menus,
        pagination: {
            page,
            limit,
            totalData,
            totalPages: Math.ceil(totalData / limit)
        }
    };
};

export const getMenuByIdService = async (id) => {
    const menu = await prisma.menus.findUnique({
        where: {
            ID: id 
        },
        include: {
            Category: {
                select: {
                    ID: true,
                    Name: true 
                }
            }
        }
    });

    if (!menu) {
        throw new ApiError(
            404,
            "Menu not found"
        );
    }

    return {
        ID: menu.ID,
        Name: menu.Name,
        Description: menu.Description,
        Price: menu.Price,
        CategoryID: menu.CategoryID,
        Category: menu.Category.Name 
    };
};