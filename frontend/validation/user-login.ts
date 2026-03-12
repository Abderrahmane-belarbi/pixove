import { z } from "zod";

export const UserLoginSchema = z.object({
  email: z
    .email({ error: "Invalid email" })
    .max(50, { error: "Email should be less then 50 characters" }),
  password: z
    .string()
    .min(6, { error: "Password should be at least 6 characters" })
    .max(50, { error: "Password should be less then 50 characters" }),
});

export type UserLogin = z.infer<typeof UserLoginSchema>;
