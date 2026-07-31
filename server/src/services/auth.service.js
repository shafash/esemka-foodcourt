import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

export const registerService = async (payload) => {
    const {
        FirstName,
        LastName,
        Email,
        PhoneNumber,
        Password,
    } = payload;

    const existingUser = await prisma.users.findUnique({
        where: {
            Email: Email,
        },
    });

    if (existingUser) {
        throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(
        Password, 
        10
    );

    const user = await prisma.users.create({
        data: {
            FirstName,
            LastName,
            Email,
            PhoneNumber,
            Password: hashedPassword,
            DateJoined: new Date(),
            RoleID: 2,
        },
    });

    return user;
};

export const loginService = async (payload) => {

};