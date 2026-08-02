import { z } from "zod";

export const categorySchema = z.object({
    Name: z.string() .trim() .min(2, "Category name must be at least 2 characters") .max(100 , "Category name cannot exceed 100 characters")
});