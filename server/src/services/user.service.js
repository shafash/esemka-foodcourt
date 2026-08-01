import prisma from "../config/prisma.js";
import ApiError from "../errors/ApiError.js";
import bcrypt from "bcryptjs";

export const getProfileService = async (
    userId
) => {
    const user = await prisma.users.findUnique({
        where: {
            ID: userId 
        },

        include: {
            Role: true 
        },
    });

    if (!user) {
        throw new ApiError(
            404, 
            "User not found"
        );
    }

    return {
        ID: user.ID,
        FirstName: user.FirstName,
        LastName: user.LastName,
        Email: user.Email,
        PhoneNumber: user.PhoneNumber,
        DateJoined: user.DateJoined,
        Role: user.Role.Name 
    };
};

export const updateProfileService = async (
    userId,
    payload
) => {
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

    const updatedUser = await prisma.users.update({
        where: {
            ID: userId 
        },

        data: {
            FirstName: payload.FirstName,
            LastName: payload.LastName,
            PhoneNumber: payload.PhoneNumber
        }
    });

    return {
        ID: updatedUser.ID,
        FirstName: updatedUser.FirstName,
        LastName: updatedUser.LastName,
        Email: updatedUser.Email,
        PhoneNumber: updatedUser.PhoneNumber,
        DateJoined: updatedUser.DateJoined,
        RoleID: updatedUser.RoleID 
    };
};

export const changePasswordService = async (
    userId,
    payload
) => {
    const {
        CurrentPassword,
        NewPassword
    } = payload;

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

    const isMatch = await bcrypt.compare(
        CurrentPassword,
        user.Password 
    );

    if (!isMatch) {
        throw new ApiError(
            401,
            "Current password is incorrect"
        );
    }

    if (CurrentPassword === NewPassword) {
        throw new ApiError(
            400,
            "New password cannot be the same as the current password"
        );
    }

    const hashedPassword = await bcrypt.hash(
        NewPassword,
        10 
    );

    await prisma.users.update({
        where: {
            ID: userId 
        },

        data: {
            Password: hashedPassword
        }
    });
};