import { z } from "zod";

export const registerSchema = z.object({
    FirstName: z.string().min(2),
    LastName: z.string().min(2),
    Email: z.string().email(),
    PhoneNumber: z.string().min(10),
    Password: z.string().min(6),
});

export const loginSchema = z.object({
    Email: z.string().email(),
    Password: z.string().min(6),
});

export const registerValidation = (body) => {

};

export const loginValidation = (body) => {

};