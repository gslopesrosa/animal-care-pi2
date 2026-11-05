
import { z } from "zod";

export const createMedicationSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do medicamento"),
  dosage: z.string().trim().min(1, "Informe a dosagem"),
  frequency: z.string().trim().min(1, "Informe a frequência"),
  startDate: z.iso.datetime({
    error: "Informe uma data de início válida",
  }),
  endDate: z.iso.datetime({
    error: "Informe uma data de término válida",
  }).optional(),
  notes: z.string().trim().optional(),
});

export type CreateMedicationInput = z.infer<
  typeof createMedicationSchema
>;
