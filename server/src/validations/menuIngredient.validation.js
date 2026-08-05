import { z } from "zod";

export const createMenuIngredientSchema = z.object({
    MenuID: z.number({
        required_error: "Menu is required"
    }),

    IngredientName: z.string() .trim() .min(1, "Ingredient name is required"),
    UnitName: z.string() .trim() .min(1, "Unit name is required"),
    Qty: z.number({
        required_error: "Quantity is required"
    }) .positive("Quantity must be greater than zero")
});

export const updateMenuIngredientSchema = z.object({
    MenuID: z.number({
        required_error: "Menu is required"
    }),

    IngredientName: z.string() .trim() .min(1, "Ingredient is required"),
    Qty: z.number({
        required_error: "Quantity is required"
    }) .positive("Quantity must be greater than zero")
});