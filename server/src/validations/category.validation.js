import { z } from "zod";

export const categorySchema = z.object({
    Name: z.string() .trim() .min(2) .max(100)
});