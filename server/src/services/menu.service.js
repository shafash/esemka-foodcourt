import prisma from "../config/prisma.js";
import ApiError from "../errors/ApiError.js";

export const getAllMenusService = async ({
    page,
    limit,
    search
}) => {
    const skip = (page - 1) * limit;

    const where = {
        DeletedAt: null,
        ...(search && {
            Name: {
                contains: search 
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
                    ID: true,
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

export const createMenuService = async (payload) => {
    const category = await prisma.categories.findFirst({
        where: {
            ID: payload.CategoryID,
            DeletedAt: null
        }
    });

    if (!category) {
        throw new ApiError(
            404,
            "Category not found"
        );
    }

    const menuExists = await prisma.menus.findFirst({
        where: {
            Name: payload.Name,
            DeletedAt: null
        }
    });

    if (menuExists) {
        throw new ApiError(
            409,
            "Menu name already exists"
        );
    }

    const menu = await prisma.menus.create({
        data: {
            CategoryID: payload.CategoryID,
            Name: payload.Name,
            Description: payload.Description,
            Price: payload.Price,
            Image: payload.Image || null
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

    return {
        ID: menu.ID,
        CategoryID: menu.CategoryID,
        Category: menu.Category.Name,
        Name: menu.Name,
        Description: menu.Description,
        Price: menu.Price,
        Image: menu.Image
    };
};

export const getMenuByIdService = async (id) => {
    const menu = await prisma.menus.findFirst({
        where: {
            ID: id,
            DeletedAt: null
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
        Category: menu.Category.Name,
        Image: menu.Image
    };
};

export const updateMenuService = async (
    id,
    payload 
) => {
    const menu = await prisma.menus.findFirst({
        where: {
            ID: id,
            DeletedAt: null
        }
    });

    if (!menu) {
        throw new ApiError(
            404,
            "Menu not found"
        );
    }

    const category = await prisma.categories.findFirst({
        where: {
            ID: payload.CategoryID,
            DeletedAt: null
        }
    });

    if (!category) {
        throw new ApiError(
            404,
            "Category not found"
        );
    }

    const duplicate = await prisma.menus.findFirst({
        where: {
            Name: payload.Name,
            DeletedAt: null,
            NOT: { ID: id }
        }
    });
    
    if (duplicate) {
        throw new ApiError(409, "Menu name already exists");
    }
    
    const updateMenu = await prisma.menus.update({
        where: {
            ID: id
        },

        data: {
            CategoryID: payload.CategoryID,
            Name: payload.Name,
            Description: payload.Description,
            Price: payload.Price,
            Image: payload.Image ?? undefined
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

    return {
        ID: updateMenu.ID,
        CategoryID: updateMenu.CategoryID,
        Category: updateMenu.Category.Name,
        Name: updateMenu.Name,
        Description: updateMenu.Description,
        Price: updateMenu.Price,
        Image: updateMenu.Image
    };
};

export const deleteMenuService = async (id) => {
    const menu = await prisma.menus.findFirst({
        where: {
            ID: id,
            DeletedAt: null
        }
    });

    if (!menu) {
        throw new ApiError(
            404,
            "Menu not found" 
        );
    }

    const reservationCount = await prisma.reservationDetails.count({
        where: {
            MenuID: id 
        }
    });

    if (reservationCount > 0) {
        throw new ApiError(
            409,
            "Menu cannot be deleted because it is used in reservation"
        );
    }

    await prisma.menus.update({
        where: {
            ID: id
        },
        data: {
            DeletedAt: new Date()
        }
    });
};