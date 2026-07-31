import prisma from "../config/prisma.js";
import ApiError from "../errors/ApiError.js";

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
) => {

};

export const changePasswordService = async (
) => {

};