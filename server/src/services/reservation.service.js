import prisma from "../config/prisma.js";
import ApiError from "../errors/ApiError.js";

export const getAllReservationsService = async ({
    userId,
    page,
    limit,
    search
}) => {
    const skip = (page - 1) * limit;

    const where = {
        UserID: userId,

        ...(search && {
            OR: [
                {
                    CustomerFirstName: {
                        contains: search
                    }
                },
                {
                    CustomerLastName: {
                        contains: search
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
        })
    };

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
            CustomerFirstName: item.CustomerFirstName,
            CustomerLastName: item.CustomerLastName,
            CustomerEmail: item.CustomerEmail,
            CustomerPhoneNumber: item.CustomerPhoneNumber,
            ReservationDate: item.ReservationDate,
            ReservationTime: item.ReservationTime,
            NumberOfPeople: item.NumberOfPeople,
            Status: item.Status,
            CreatedAt: item.CreatedAt,

            Table: {
                ID: item.Table.ID,
                Name: item.Table.Name
            }
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
            Quantity: item.Qty,
            Price: Number(item.Menu.Price),
            Subtotal: Number(item.Qty) * Number(item.Menu.Price)
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

export const createReservationService = async (
    userId,
    payload
) => {
    let {
        CustomerFirstName,
        CustomerLastName,
        CustomerEmail,
        CustomerPhoneNumber,
        ReservationDate,
        ReservationTime,
        NumberOfPeople,
        TableID,
        Items,
        UseAccountData
    } = payload;

    // Jika pakai data akun
    if (UseAccountData) {
        const user = await prisma.users.findUnique({
            where: {
                ID: userId
            }
        });

        if (!user) {
            throw new ApiError(
                404,
                "User not found"
            );
        }

        CustomerFirstName = user.FirstName;
        CustomerLastName = user.LastName;
        CustomerEmail = user.Email;
        CustomerPhoneNumber = user.PhoneNumber;
    }

    const table = await prisma.tables.findUnique({
        where: {
            ID: TableID
        }
    });

    if (!table) {
        throw new ApiError(
            404,
            "Table not found"
        );
    }

    const mergedItems = [];

    for (const item of Items) {
        const existing = mergedItems.find(
            menu => menu.MenuID === item.MenuID
        );

        if (existing) {
            existing.Quantity += item.Quantity;
        } else {
            mergedItems.push({
                MenuID: item.MenuID,
                Quantity: item.Quantity
            });
        }
    }

    const menuIds = mergedItems.map(
        item => item.MenuID
    );

    const menus = await prisma.menus.findMany({
        where: {
            ID: {
                in: menuIds
            }
        }
    });

    if (menus.length !== menuIds.length) {
        throw new ApiError(
            404,
            "Menu not found"
        );
    }

    const existingReservation =
        await prisma.reservations.findFirst({
            where: {
                TableID,
                ReservationDate,
                ReservationTime,
                Status: {
                    in: [
                        "Pending",
                        "Confirmed"
                    ]
                }
            }
        });

    if (existingReservation) {
        throw new ApiError(
            409,
            "Table is already reserved"
        );
    }

    const reservation = await prisma.$transaction(
        async (tx) => {
            const createdReservation =
                await tx.reservations.create({
                    data: {
                        UserID: userId,
                        CustomerFirstName,
                        CustomerLastName,
                        CustomerEmail,
                        CustomerPhoneNumber,
                        NumberOfPeople,
                        TableID,
                        ReservationDate,
                        ReservationTime
                    }
                });

            await tx.reservationDetails.createMany({
                data: mergedItems.map(item => ({
                    ReservationID: createdReservation.ID,
                    MenuID: item.MenuID,
                    Qty: item.Quantity
                }))
            });

            return createdReservation;
        }
    );

    return reservation;
};

export const getMyReservationsService = async ({
    userId,
    page,
    limit,
    search
}) => {
    return await getAllReservationsService({
        userId,
        page,
        limit,
        search
    });
};

export const getMyReservationByIdService = async (
    userId,
    id
) => {
    const reservation = await prisma.reservations.findFirst({
        where: {
            ID: id,
            UserID: userId
        },

        include: {
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
        CustomerFirstName: reservation.CustomerFirstName,
        CustomerLastName: reservation.CustomerLastName,
        CustomerEmail: reservation.CustomerEmail,
        CustomerPhoneNumber: reservation.CustomerPhoneNumber,
        ReservationDate: reservation.ReservationDate,
        ReservationTime: reservation.ReservationTime,
        NumberOfPeople: reservation.NumberOfPeople,
        Status: reservation.Status,

        Table: {
            ID: reservation.Table.ID,
            Name: reservation.Table.Name
        },

        ReservationDetails: reservation.ReservationDetails.map(item => ({
            MenuID: item.Menu.ID,
            MenuName: item.Menu.Name,
            Quantity: item.Qty,
            Price: Number(item.Menu.Price),
            Subtotal: item.Qty * Number(item.Menu.Price)
        }))
    };
};

export const cancelReservationService = async (
    userId,
    reservationId
) => {
    const reservation = await prisma.reservations.findFirst({
        where: {
            ID: reservationId,
            UserID: userId
        }
    });

    if (!reservation) {
        throw new ApiError(
            404,
            "Reservation not found"
        );
    }

    if (reservation.Status !== "Pending") {
        throw new ApiError(
            409,
            "Only pending reservations can be cancelled"
        );
    }

    const updatedReservation = await prisma.reservations.update({
        where: {
            ID: reservationId
        },

        data: {
            Status: "Cancelled"
        },

        include: {
            Table: {
                select: {
                    ID: true,
                    Name: true
                }
            }
        }
    });

    return {
        ID: updatedReservation.ID,
        CustomerFirstName: updatedReservation.CustomerFirstName,
        CustomerLastName: updatedReservation.CustomerLastName,
        ReservationDate: updatedReservation.ReservationDate,
        ReservationTime: updatedReservation.ReservationTime,
        NumberOfPeople: updatedReservation.NumberOfPeople,
        Status: updatedReservation.Status,

        Table: {
            ID: updatedReservation.Table.ID,
            Name: updatedReservation.Table.Name
        }
    };
};