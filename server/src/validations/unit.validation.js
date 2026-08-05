import { z } from "zod";

export const createUnitSchema = z.object({
    Name: z .string() .trim() .min(1, "Unit name is required") 
});

export const updateUnitSchema = z.object({
    Name: z .string() .trim() .min(1, "Unit name is required")
});