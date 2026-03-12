import { z } from "zod";
import { UserLoginSchema } from "./user-login";

export const UserRegisterSchema = UserLoginSchema.extend({
  name: z
    .string()
    .min(4, { error: "Name should be at least 4 characters" })
    .max(50, { error: "Name should be less then 50 characters" }),
});

export type UserRegister = z.infer<typeof UserRegisterSchema>;
