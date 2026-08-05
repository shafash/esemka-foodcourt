import prisma from "../config/prisma.js";
import ApiError from "../errors/ApiError.js";

export const getAllTablesService = async ({
    page,
    limit,
    search
}) => {
    const skip = (page - 1) * limit;
    const where = search
        ? {
            Name: {
                contains: search
            }
        }
        : {};

    const totalData = await prisma.tables.count({
        where
    });

    const data = await prisma.tables.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
            ID: "asc"
        }
    });

    return {
        tables: data,
        pagination: {
            page,
            limit,
            totalData,
            totalPages: Math.ceil(totalData / limit)
        }
    };
};

export const getTableByIdService = async (
    id
) => {
    const table = await prisma.tables.findUnique({
        where: {
            ID: id
        }
    });

    if (!table) {
        throw new ApiError(
            404,
            "Table not found"
        );
    }
    return table;
};

export const createTableService = async (
    payload
) => {
    const existing = await prisma.tables.findFirst({
        where: {
            Name: {
                equals: payload.Name
            }
        }
    });

    if (existing) {
        throw new ApiError(
            409,
            "Table name already exists"
        );
    }

    const table = await prisma.tables.create({
        data: {
            Name: payload.Name
        }
    }); 

    return table;
};

export const updateTableService = async (
    id,
    payload
) => {
    const table = await prisma.tables.findUnique({
        where: {
            ID: id
        }
    });

    if (!table) {
        throw new ApiError(
            404,
            "Table not found"
        );
    }

    const duplicate = await prisma.tables.findFirst({
        where: {
            Name: {
                equals: payload.Name
            },

            NOT: {
                ID: id
            }
        }
    });

    if (duplicate) {
        throw new ApiError(
            409,
            "Table name already exists"
        );
    }

    const updated = await prisma.tables.update({
        where: {
            ID: id
        },

        data: {
            Name: payload.Name
        }
    });

    return updated;
};

export const deleteTableService = async (
    id
) => {
    const table = await prisma.tables.findUnique({
        where: {
            ID: id
        }
    });

    if (!table) {
        throw new ApiError(
            404,
            "Table not found"
        );
    }

    const reservation = await prisma.reservations.findFirst({
        where: {
            TableID: id
        }
    });

    if (reservation) {
        throw new ApiError(
            409,
            "Table cannot be deleted because it is used in reservations"
        );
    }

    await prisma.tables.delete({
        where: {
            ID: id
        }
    });
};