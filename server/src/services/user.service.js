import prisma from "../config/prisma.js";
import ApiError from "../errors/ApiError.js";
import bcrypt from "bcryptjs";

export const getAllMembersService = async ({
    page,
    limit,
    search
}) => {
    const skip = (page - 1) * limit;
    const where = {
        RoleID: 2,
        OR: [
            {
                FirstName: {
                    contains: search,
                },
            },

            {
                LastName: {
                    contains: search,
                },
            },

            {
                Email: {
                    contains: search,
                },
            },
        ],
    };

    const totalData = await prisma.users.count({
        where,
    });

    const members = await prisma.users.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
            DateJoined: "desc"
        },

        include: {
            Role: {
                select: {
                    Name: true 
                }
            },

            _count: {
                select: {
                    Reservations: true 
                }
            }
        }
    });

    return {
        members: members.map(member => ({
            ID: member.ID,
            FirstName: member.FirstName,
            LastName: member.LastName,
            Email: member.Email,
            PhoneNumber: member.PhoneNumber,
            DateJoined: member.DateJoined,
            Role: member.Role.Name,
            ReservationCount: member._count.Reservations 
        })),

        pagination: {
            page,
            limit,
            totalData,
            totalPages: Math.ceil(totalData / limit)
        }
    };
};

export const getMemberByIdService = async (id) => {
    const member = await prisma.users.findFirst({
        where: {
            ID: id,
            RoleID: 2
        },

        include: {
            Role: {
                select: {
                    Name: true 
                }
            },

            _count: {
                select: {
                    Reservations: true 
                }
            }
        }
    });

    if (!member) {
        throw new ApiError(
            404,
            "Member not found"
        );
    }

    return {
        ID: member.ID,
        FirstName: member.FirstName,
        LastName: member.LastName,
        Email: member.Email,
        PhoneNumber: member.PhoneNumber,
        DateJoined: member.DateJoined,
        Role: member.Role.Name,
        ReservationCount: member._count.Reservations 
    };
};

export const createMemberService = async (
    payload
) => {
    const emailExists = await prisma.users.findUnique({
        where: {
            Email: payload.Email 
        }
    });

    if (emailExists) {
        throw new ApiError(
            409,
            "Email already registered"
        );
    }

    const hashedPassword = await bcrypt.hash(
        payload.Password,
        10 
    );

    const member = await prisma.users.create({
        data:  {
            FirstName: payload.FirstName,
            LastName: payload.LastName,
            Email: payload.Email,
            PhoneNumber: payload.PhoneNumber,
            Password: hashedPassword,
            RoleID: 2
        },

        include: {
            Role: {
                select: {
                    Name: true 
                }
            }
        }
    });

    return {
        ID: member.ID,
        FirstName: member.FirstName,
        LastName: member.LastName,
        Email: member.Email,
        PhoneNumber: member.PhoneNumber,
        DateJoined: member.DateJoined,
        Role: member.Role.Name 
    };
};