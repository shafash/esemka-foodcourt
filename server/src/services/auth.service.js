import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    const {
        Email,
        Password,
    } = payload;

    const user = await prisma.users.findUnique({
        where: {
            Email
        },
    }); 

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(
        Password,
        user.Password
    );

    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        {
            ID: user.ID,
            role: user.RoleID,
        },

        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        }
    );

    return {
        token,
        user
    };
};