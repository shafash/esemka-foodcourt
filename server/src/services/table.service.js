import prisma from "../config/prisma.js";
import ApiError from "../errors/ApiError.js";
import { ACTIVE_RESERVATION_STATUSES } from "../utils/reservationStatus.js";

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

const pad2 = (n) => String(n).padStart(2, "0");

const getTimeSlot = (time) => {
    if (time) return time;

    const now = new Date();
    return `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
};

export const getAllTablesService = async ({
    page,
    limit,
    search,
    date,
    time
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
    const timeSlot = getTimeSlot(time);

    let reservations = [];

    if (dateRange) {
        reservations = await prisma.reservations.findMany({
            where: {
                ReservationDate: {
                    gte: dateRange.start,
                    lte: dateRange.end
                },
                ReservationTime: timeSlot,
                Status: {
                    in: ACTIVE_RESERVATION_STATUSES
                }
            },
            select: {
                ID: true,
                TableID: true
            }
        });
    }

    const reservedMap = new Map();
    for (const reservation of reservations) {
        if (!reservedMap.has(reservation.TableID)) {
            reservedMap.set(reservation.TableID, reservation.ID);
        }
    }

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

export const getAllTables = async (
    req,
    res,
    next
) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search?.trim() || "";
        const date = req.query.date || "";
        const time = req.query.time || "";
        const result = await getAllTablesService({
            page,
            limit,
            search,
            date,
            time
        });

        return successResponse(
            res,
            "Tables retrieved successfully",
            result
        );
    } catch (error) {
        next(error);
    }
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