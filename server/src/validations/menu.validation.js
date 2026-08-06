import { z } from "zod";

export const createMenuSchema = z.object({
    CategoryID: z.coerce.number() .int() .positive(),
    Name: z .string() .min(1),
    Description: z .string() .optional(),
    Price: z .number() .positive()
});

export const updateMenuSchema = z.object({
    CategoryID: z .number() .int() .positive(),
    Name: z .string() .min(1),
    Description: z .string() .optional(),
    Price: z .number() .positive()
});