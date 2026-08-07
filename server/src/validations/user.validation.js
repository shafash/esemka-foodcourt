import { z } from "zod";

export const updateProfileSchema = z.object({
    FirstName: z .string() .trim() .min(2) .max(50), 
    LastName: z .string() .trim() .min(2) .max(50),
    PhoneNumber: z .string() .trim() .min(10) .max(15) 
});

export const changePasswordSchema = z.object({
    CurrentPassword: z .string() .min(6),
    NewPassword: z .string() .min(6) 
});

export const createMemberSchema = z.object({
    FirstName: z .string() .min(1),
    LastName: z .string() .min(1),
    Email: z .email(),
    PhoneNumber: z .string() .min(1),
    Password: z .string() .min(8)
});

export const updateMemberSchema = z.object({
    FirstName: z .string() .min(1),
    LastName: z .string() .min(1),
    Email: z .email(),
    PhoneNumber: z .string() .min(1),
    Password: z .string() .min(8) .optional()
});