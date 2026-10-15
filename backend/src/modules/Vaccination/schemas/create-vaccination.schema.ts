import { z } from "zod";

export const createVaccinationSchema = z.object({
  vaccineName: z
    .string()
    .trim()
    .min(2, "Informe o nome da vacina"),

  applicationDate: z.iso.datetime({
    error: "Informe uma data de aplicação válida",
  }),

  nextDoseDate: z.iso.datetime({
    error: "Informe uma data válida para a próxima dose",
  }).optional(),

  responsible: z
    .string()
    .trim()
    .min(2, "O nome do responsável deve ter pelo menos 2 caracteres")
    .optional(),
});

export type CreateVaccinationInput = z.infer<
  typeof createVaccinationSchema
>;
