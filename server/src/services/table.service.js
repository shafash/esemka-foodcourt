import prisma from "../config/prisma.js";
import ApiError from "../errors/ApiError.js";


const ACTIVE_STATUSES = ["Pending", "Confirmed"];

const getDateRange = (date) => {
    const selectedDate = date ? new Date(`${date}T00:00:00`) : new Date();

    if (Number.isNaN(selectedDate.getTime())) {
        return null;
    }

    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);

    return { start, end };
};

export const getAllTablesService = async ({
    page,
    limit,
    search,
    date
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

    const dateRange = getDateRange(date);

    let reservations = [];

    if (dateRange) {
        reservations = await prisma.reservations.findMany({
            where: {
                ReservationDate: {
                    gte: dateRange.start,
                    lte: dateRange.end
                },
                Status: {
                    in: ACTIVE_STATUSES
                }
            },
            select: {
                ID: true,
                TableID: true
            }
        });
    }

    const reservedMap = new Map(
        reservations.map((reservation) => [
            reservation.TableID,
            reservation.ID
        ])
    );

    return {
        tables: data.map((table) => ({
            ...table,
            status: reservedMap.has(table.ID)
                ? "reserved"
                : "available",
            reservationId: reservedMap.get(table.ID) || null
        })),

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