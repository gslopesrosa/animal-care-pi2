
import { z } from "zod";

export const authenticateUserSchema = z.object({
  email: z
    .string()
    .trim()
    .email("E-mail inválido"),

  password: z
    .string()
    .min(1, "A senha é obrigatória"),
});

export type AuthenticateUserInput = z.infer<
  typeof authenticateUserSchema
>;