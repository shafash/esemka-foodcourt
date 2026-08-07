import { z } from "zod";

export const updateReservationSchema = z.object({
    Status: z.enum([
        "Pending",
        "Confirmed",
        "Completed",
        "Cancelled"
    ])
});

export const createReservationSchema = z.object({
    UseAccountData: z.boolean(),

    CustomerFirstName: z.string().trim().optional(),
    CustomerLastName: z.string().trim().optional(),
    CustomerEmail: z.email().optional(),
    CustomerPhoneNumber: z.string().min(8).max(20).optional(),

    ReservationDate: z.coerce.date(),

    ReservationTime: z.string().regex(
        /^([01]\d|2[0-3]):([0-5]\d)$/
    ),

    NumberOfPeople: z.coerce.number().int().positive(),

    TableID: z.coerce.number().int().positive(),

    Items: z.array(
        z.object({
            MenuID: z.coerce.number().int().positive(),
            Quantity: z.coerce.number().int().positive()
        })
    ).min(1)
}).superRefine((data, ctx) => {
    if (!data.UseAccountData) {
        if (!data.CustomerFirstName) {
            ctx.addIssue({
                code: "custom",
                path: ["CustomerFirstName"],
                message: "Customer first name is required"
            });
        }

        if (!data.CustomerLastName) {
            ctx.addIssue({
                code: "custom",
                path: ["CustomerLastName"],
                message: "Customer last name is required"
            });
        }

        if (!data.CustomerEmail) {
            ctx.addIssue({
                code: "custom",
                path: ["CustomerEmail"],
                message: "Customer email is required"
            });
        }

        if (!data.CustomerPhoneNumber) {
            ctx.addIssue({
                code: "custom",
                path: ["CustomerPhoneNumber"],
                message: "Customer phone number is required"
            });
        }
    }
});