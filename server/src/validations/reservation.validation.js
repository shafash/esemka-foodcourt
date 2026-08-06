import { z } from "zod";

export const updateReservationSchema = z.object({
    Status: z.enum([
        "Pending",
        "Confirmed",
        "Completed",
        "Cancelled"
    ])
});