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
    CustomerEmail: z.email("Format email tidak valid.").optional(),
    CustomerPhoneNumber: z
        .string()
        .min(8, "Nomor telepon minimal 8 karakter.")
        .max(20, "Nomor telepon maksimal 20 karakter.")
        .optional(),

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
                message: "Nama depan pelanggan wajib diisi."
            });
        }

        if (!data.CustomerLastName) {
            ctx.addIssue({
                code: "custom",
                path: ["CustomerLastName"],
                message: "Nama belakang pelanggan wajib diisi."
            });
        }

        if (!data.CustomerEmail) {
            ctx.addIssue({
                code: "custom",
                path: ["CustomerEmail"],
                message: "Email pelanggan wajib diisi."
            });
        }

        if (!data.CustomerPhoneNumber) {
            ctx.addIssue({
                code: "custom",
                path: ["CustomerPhoneNumber"],
                message: "Nomor telepon pelanggan wajib diisi."
            });
        }
    }
});