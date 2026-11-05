
import { z } from "zod";

export const updateMedicationSchema = z.object({
  name: z.string().trim().min(2).optional(),
  dosage: z.string().trim().min(1).optional(),
  frequency: z.string().trim().min(1).optional(),
  startDate: z.iso.datetime().optional(),
  endDate: z.iso.datetime().nullable().optional(),
  notes: z.string().trim().nullable().optional(),
});

export type UpdateMedicationInput = z.infer<
  typeof updateMedicationSchema
>;
