
import { z } from "zod";

export const updateAppointmentSchema = z.object({
  date: z.iso.datetime().optional(),
  clinic: z.string().trim().min(2).nullable().optional(),
  veterinarian: z.string().trim().min(2).nullable().optional(),
  diagnosis: z.string().trim().nullable().optional(),
  notes: z.string().trim().nullable().optional(),
});

export type UpdateAppointmentInput = z.infer<
  typeof updateAppointmentSchema
>;
