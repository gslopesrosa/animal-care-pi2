
import { z } from "zod";

export const createAppointmentSchema = z.object({
  date: z.iso.datetime({
    error: "Informe uma data e horário válidos para a consulta",
  }),
  clinic: z.string().trim().min(2, "Informe o nome da clínica").optional(),
  veterinarian: z.string().trim().min(2, "Informe o nome do veterinário").optional(),
  diagnosis: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export type CreateAppointmentInput = z.infer<
  typeof createAppointmentSchema
>;
