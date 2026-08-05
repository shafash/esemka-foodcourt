import { z } from "zod";

export const createTableSchema = z.object({
    Name: z.string() .trim() .min(1, "Table name is required")
});

export const updateTableSchema = z.object({
    Name: z.string() .trim() .min(1, "Table name is required")
});