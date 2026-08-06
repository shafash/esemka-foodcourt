import prisma from "../config/prisma.js";
import ApiError from "../errors/ApiError.js";

export const getAllReservationsService = async ({
    page,
    limit,
    search 
}) => {
    const skip = (page - 1) * limit;

    const where = search ? {
        OR: [
            {
                User: {
                    OR: [
                        {
                            FirstName: {
                                contains: search 
                            }
                        },
                        {
                            LastName: {
                                constains: search 
                            }
                        },
                        {
                            Email: {
                                contains: search 
                            }
                        }
                    ]
                }
            },

            {
                Table: {
                    Name: {
                        contains: search 
                    }
                }
            },

            {
                Status: {
                    contains: search 
                }
            }

        ]
    }
    : {};

    const totalData = await prisma.reservations.count({
        where 
    });

    const data = await prisma.reservations.findMany({
        where,
        skip,
        take: limit, 
        orderBy: {
            CreatedAt: "desc"
        },
        include: {
            User: {
                select: {
                    ID: true,
                    FristName: true,
                    LastName: true,
                    Email: true 
                }
            },

            Table: {
                select: {
                    ID: true,
                    Name: true 
                }
            }
        }
    });

    return {
        reservations: data.map(item => ({
            ID: item.ID,
            ReservationDate: item.ReservationDate,
            ReservationTime: item.ReservationTime,
            NumberOfPeople: item.NumberOfPeople,
            Status: item.Status,
            CreatedAt: item.CreatedAt,
            UserID: item.User.ID,
            FullName: `${item.User.FirstName} ${item.User.LastName}`,
            Email: item.User.Email,
            TableID: item.Table.ID,
            TableName: item.Table.Name
        })),

        pagination: {
            page,
            limit,
            totalData,
            totalPages: Math.ceil(totalData / limit)
        }
    };
};

export const getReservationByIdService = async (
    id
) => {
    const reservation = await prisma.reservations.findUnique({
        where: {
            ID: id
        },

        include: {
            User: {
                select: {
                    ID: true,
                    FirstName: true,
                    LastName: true,
                    Email: true
                }
            },

            Table: {
                select: {
                    ID: true,
                    Name: true
                }
            },

            ReservationDetails: {
                include: {
                    Menu: {

                        select: {

                            ID: true,
                            Name: true,
                            Price: true

                        }
                    }
                }
            }
        }
    });

    if (!reservation) {
        throw new ApiError(
            404,
            "Reservation not found"
        );
    }

    return {
        ID: reservation.ID,
        ReservationDate: reservation.ReservationDate,
        ReservationTime: reservation.ReservationTime,
        NumberOfPeople: reservation.NumberOfPeople,
        Status: reservation.Status,

        User: {
            ID: reservation.User.ID,
            FullName: `${reservation.User.FirstName} ${reservation.User.LastName}`,
            Email: reservation.User.Email
        },

        Table: {
            ID: reservation.Table.ID,
            Name: reservation.Table.Name
        },

        ReservationDetails: reservation.ReservationDetails.map(item => ({
            ID: item.ID,
            MenuID: item.Menu.ID,
            MenuName: item.Menu.Name,
            Quantity: item.Quantity,
            Price: item.Menu.Price,
            Subtotal: Number(item.Quantity) * Number(item.Menu.Price)
        }))
    };
};

export const updateReservationService = async (
    id,
    payload
) => {
    const reservation = await prisma.reservations.findUnique({
        where: {
            ID: id
        }
    });

    if (!reservation) {
        throw new ApiError(
            404,
            "Reservation not found"
        );
    }

    const updated = await prisma.reservations.update({
        where: {
            ID: id
        },

        data: {
            Status: payload.Status
        },

        include: {
            User: {
                select: {
                    ID: true,
                    FirstName: true,
                    LastName: true
                }
            },

            Table: {
                select: {
                    ID: true,
                    Name: true
                }
            }
        }
    });

    return {
        ID: updated.ID,
        ReservationDate: updated.ReservationDate,
        ReservationTime: updated.ReservationTime,
        NumberOfPeople: updated.NumberOfPeople,
        Status: updated.Status,

        User: {
            ID: updated.User.ID,
            FullName: `${updated.User.FirstName} ${updated.User.LastName}`
        },

        Table: {
            ID: updated.Table.ID,
            Name: updated.Table.Name
        }
    };
};

export const deleteReservationService = async (
    id
) => {
    const reservation = await prisma.reservations.findUnique({
        where: {
           ID: id
        }
    });

    if (!reservation) {
        throw new ApiError(
            404,
            "Reservation not found"
        );
    }

    await prisma.$transaction([
        prisma.reservationDetails.deleteMany({
            where: {
                ReservationID: id
            }
        }),

        prisma.reservations.delete({
            where: {
                ID: id
            }
        })
    ]);
};