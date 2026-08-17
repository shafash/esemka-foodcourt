import { z } from "zod";

export const registerSchema = z.object({
  FirstName: z.string().min(2),
  LastName: z.string().min(2),
  Email: z.email(),
  PhoneNumber: z.string().min(10),
  Password: z
    .string()
    .min(8, "Password minimal 8 karakter.")
    .regex(/[^A-Za-z0-9]/, "Password harus mengandung minimal satu simbol."),
});

export const loginSchema = z.object({
  Email: z.email(),
  Password: z.string().min(6),
});

export const registerValidation = (body) => {
  return registerSchema.parse(body);
};

export const loginValidation = (body) => {
  return loginSchema.parse(body);
};