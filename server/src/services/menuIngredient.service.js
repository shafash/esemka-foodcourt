import prisma from "../config/prisma.js";
import ApiError from "../errors/ApiError.js";

export const getAllMenuIngredientsService = async ({
    page,
    limit,
    search 
}) => {
    const skip = (page - 1) * limit;

    const where = search ? {
        OR: [
            {
                Menu: {
                    Name: {
                        contains: search 
                    }
                }
            },

            {
                Ingredient: {
                    Name: {
                        contains: search 
                    }
                }
            }
        ]
    }
    : {};

    const totalData = await prisma.menuIngredients.count({
        where 
    });

    const data = await prisma.menuIngredients.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
            ID: "asc"
        },
        include: {
            Menu: {
                select: {
                    ID: true,
                    Name: true 
                }
            },
            Ingredient: {
                select: {
                    ID: true,
                    Name: true 
                }
            },
            Unit: {
                select: {
                    ID: true,
                    Name: true 
                }
            }
        }
    });

    return {
        menuIngredients: data.map(item => ({
            ID: item.ID,
            MenuID: item.MenuID,
            MenuName: item.Menu.Name,
            IngredientID: item.IngredientID,
            IngredientName: item.IngredientName,
            UnitID: item.UnitID,
            UnitName: item.Unit.Name,
            Qty: item.Qty 
        })),

        pagination: {
            page,
            limit,
            totalData,
            totalPages: Math.ceil(totalData / limit)
        }
    };
};

export const getMenuIngredientByIdService = async (
    id
) => {
    const menuIngredient = await prisma.menuIngredients.findUnique({
        where: {
            ID: id 
        },

        include: {
            Menu: {
                select: {
                    ID: true,
                    Name: true 
                }
            },

            Ingredient: {
                select: {
                    ID: true,
                    Name: true 
                }
            },

            Unit: {
                select: {
                    ID: true,
                    Name: true 
                }
            }
        }
    });

    if (!menuIngredient) {
        throw new ApiError(
            404,
            "Menu ingredient not found"
        );

        return {
            ID: menuIngredient.ID,
            MenuID: menuIngredient.MenuID,
            MenuName: menuIngredient.Menu.Name,
            IngredientID: menuIngredient.IngredientID,
            UnitID: menuIngredient.UnitID,
            UnitName: menuIngredient.Unit.Name,
            Qty: menuIngredient.Qty 
        };
    };
}

export const createMenuIngredientService = async (
    payload
) => {
    const menu = await prisma.menus.findUnique({
        where: {
            ID: payload.MenuID 
        }
    });

    if (!menu) {
        throw new ApiError(
            404,
            "Menu not found"
        );
    }

    let ingredient = await prisma.ingredients.findFirst({
        where: {
            Name: {
                equals: payload.IngredientName
            }
        }
    });

    if (!ingredient) {
        ingredient = await prisma.ingredients.create({
            data: {
                Name: payload.IngredientName 
            }
        });
    }

    let unit = await prisma.units.findFirst({
        where: {
            Name: {
                equals: payload.UnitName
            }
        }
    });

    if (!unit) {
        unit = await prisma.units.create({
            data: {
                Name: payload.UnitName 
            }
        });
    }

    const duplicate = await prisma.menuIngredients.findFirst({
        where: {
            MenuID: payload.MenuID,
            IngredientID: ingredient.ID 
        }
    });

    if (duplicate) {
        throw new ApiError(
            409,
            "ingredient already exists in this menu"
        );
    }

    const menuIngredient = await prisma.menuIngredients.create({
        data: {
            MenuID: payload.MenuID,
            IngredientID: ingredient.ID,
            UnitID: unit.ID,
            Qty: payload.Qty 
        }
    });

    return menuIngredient;
};

export const updateMenuIngredientService = async (
    id,
    payload 
) => {
    const existing = await prisma.menuIngredients.findUnique({
        where: {
            ID: id
        }
    });

    if (!existing) {
        throw new ApiError(
            404,
            "Menu ingredient not found"
        );
    }

    const menu = await prisma.menus.findUnique({
        where: {
            ID: payload.MenuID 
        }
    });

    if (!menu) {
        throw new ApiError(
            404,
            "Menu not found"
        );
    }

    let ingredient = await prisma.ingredients.findFirst({
        where: {
            Name: {
                equals: payload.Ingredient
            }
        }
    });

    if (!ingredient) {
        ingredient = await prisma.ingredients.create({
            data: {
                Name: payload.Ingredient
            }
        });
    }

    let unit = await prisma.units.findFirst({
        where: {
            Name: {
                equals: payload.Unit 
            }
        }
    });

    if (!unit) {
        unit = await prisma.units.create({
            data: {
                Name: payload.Unit 
            }
        });
    }

    const duplicate = await prisma.menuIngredients.findFirst({
        where: {
            MenuID: payload.MenuID,
            IngredientID: ingredient.ID,
            NOT: {
                ID: id 
            }
        }
    });

    if (duplicate) {
        throw new ApiError(
            404,
            "Ingredient already exists in this menu"
        );
    }

    const update = await prisma.menuIngredients.update({
        where: {
            ID: id
        },

        data: {
            MenuID: payload.MenuID,
            IngredientID: ingredient.ID,
            UnitID: unit.ID,
            Qty: payload.Qty 
        },

        include: {
            Menu: {
                select: {
                    Name: true 
                }
            },

            Ingredient: {
                select: {
                    Name: true
                }
            },
            
            Unit: {
                select: {
                    Name: true 
                }
            }
        }
    });

    return {
        ID: update.ID,
        MenuID: update.MenuID,
        MenuName: update.Menu.Name,
        IngredientID: update.IngredientID,
        IngredientName: update.Ingredient.Name,
        UnitID: update.UnitID,
        UnitName: update.Unit.Name,
        Qty: update.Qty
    };
};

export const deleteMenuIngredientService = async (
    id 
) => {
    const menuIngredient = await prisma.menuIngredients.findUnique({
        where: {
            ID: id
        }
    });

    if (!menuIngredient) {
        throw new ApiError(
            404,
            "Menu ingredient not found"
        );
    }

    await prisma.menuIngredients.delete({
        where: {
            ID: id 
        }
    });
};