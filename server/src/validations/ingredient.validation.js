import { z } from "zod";

export const createIngredientSchema = z.object({
    Name: z .string() .trim() .min(1, "Ingredient name is required") 
});

export const updateIngredientSchema = z.object({
    Name: z .string() .trim() .min(1, "Ingredient name is required")
});