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

export const updateMemberService = async (
    id,
    payload 
) => {
    const member = await prisma.users.findFirst({
        where: {
            ID: id,
            RoleID: 2
        }
    });

    if (!member) {
        throw new ApiError(
            404,
            "Member not found"
        );
    }

    const emailExists = await prisma.users.findFirst({
        where: {
            Email: payload.Email,
            NOT: {
                ID: id 
            }
        }
    });

    if (emailExists) {
        throw new ApiError(
            409,
            "Email already registered"
        );
    }

    const data = {
        FirstName: payload.FirstName,
        LastName: payload.LastName,
        Email: payload.Email,
        PhoneNumber: payload.PhoneNumber 
    };

    if (payload.Password) {
        data.Password = await bcrypt.hash(
            payload.Password,
            10 
        );
    }

    const updateMember = await prisma.users.update({
        where: {
            ID: id 
        },
        data,
        include: {
            Role: {
                select: {
                    Name: true 
                }
            }
        }
    });

    return  {
        ID: updateMember.ID,
        FirstName: updateMember.FirstName,
        LastName: updateMember.LastName,
        Email: updateMember.Email,
        PhoneNumber: updateMember.PhoneNumber,
        DateJoined: updateMember.DateJoined,
        ROle: updateMember.Role.Name 
    };
};

export const deleteMemberService = async (id) => {
    const member = await prisma.users.findFirst({
        where: {
            ID: id,
            RoleID: 2
        }
    });

    if (!member) {
        throw new ApiError(
            404,
            "Member not found"
        );
    }

    const reservationCount = await prisma.reservations.count({
        where: {
            UserID: id 
        }
    });

    if (reservationCount > 0) {
        throw new ApiError(
            409,
            "Member cannot be deleted because reservation data exists"
        );
    }

    await prisma.users.delete({
        where: {
            ID: id 
        }
    });
};