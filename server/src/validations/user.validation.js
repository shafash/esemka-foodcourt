import { z } from "zod";

export const updateProfileSchema = z.object({
    FristName: z .string() .min(2),
    LastName: z .string() .min(2),
    PhoneNumber: z .string() .min(10) 
});

export const changePasswordSchema = z.object({
    CurrentPassword: z .string() .min(6),
    NewPassword: z .string() .min(6) 
});