import prisma from "../config/prisma.js";
import ApiError from "../errors/ApiError.js";

export const getAllUnitsService = async ({
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

    const totalData = await prisma.units.count({
        where 
    });

    const units = await prisma.units.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
            Name: "asc"
        }
    });

    return  {
        units,
        pagination: {
            page,
            limit,
            totalData,
            totalPages: Math.ceil(totalData / limit)
        }
    };
};

export const getUnitByIdService = async (
    id 
) => {
    const unit = await prisma.unit.findUnique({
        where: {
            ID: id 
        }
    });

    if (!unit) {
        throw new ApiError(
            404,
            "Unit not found"
        );
    }

    return {
        ID: unit.ID,
        Name: unit.Name 
    };
};

export const createUnitService = async (
    payload 
) => {
    const unit = await prisma.units.create({
        data: {
            Name: payload.Name 
        }
    });

    return {
        ID: unit.ID,
        Name: unit.Name 
    };
};

export const updateUnitService = async (
    id,
    payload
) => {
    const unit = await prisma.units.findUnique({
        where: {
            ID: id 
        }
    });

    if (!unit) {
        throw new ApiError(
            404,
            "Unit not found"
        );
    }

    const updateUnit = await prisma.units.update({
        where: {
            ID: id 
        },

        data: {
            Name: payload.Name 
        }
    });

    return {
        ID: updateUnit.ID,
        Name: updateUnit.Name 
    };
};

export const deleteUnitService = async (
    id 
) => {
    const unit = await prisma.units.findUnique({
        where: {
            ID: id
        }
    });

    if (!unit) {
        throw new ApiError(
            404,
            "Unit not found"
        );
    }

    const menuIngredientCount = await prisma.menuIngredients.count({
        where: {
            UnitID: id 
        }
    });

    if (menuIngredientCount > 0) {
        throw new ApiError(
            409,
            "Unit cannot be deleted because it is used in menu ingredients"
        );
    }

    await prisma.units.delete({
        where: {
            ID: id 
        }
    });
};