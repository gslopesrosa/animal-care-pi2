
import { z } from "zod";

export const createPetSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres"),

  species: z
    .string()
    .trim()
    .min(2, "Informe a espécie do pet"),

  breed: z.string().trim().optional(),

  sex: z.enum(["Macho", "Fêmea"]).optional(),

  birthDate: z
    .iso
    .datetime()
    .optional(),

  weight: z
    .number()
    .positive("O peso deve ser maior que zero")
    .optional(),

  photoUrl: z
    .url("Informe uma URL válida para a foto")
    .optional(),
});

export type CreatePetInput = z.infer<typeof createPetSchema>;