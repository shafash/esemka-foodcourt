import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import ApiError from "../errors/ApiError.js";

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
        throw new ApiError(409, "Email already exists");
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
        throw new ApiError(401, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(
        Password,
        user.Password
    );

    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password");
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

    const csrfToken = crypto.randomBytes(32).toString("hex");

    return {
        token,
        csrfToken,
        user
    };
};

export const getMeService = async (userId) => {
    const user = await prisma.users.findUnique({
        where: {
            ID: userId
        },
    });

    if (!user) {
        throw new ApiError(401, "Invalid session");
    }

    return user;
};