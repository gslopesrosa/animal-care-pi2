
import { z } from "zod";

export const updateReminderSchema = z.object({
  title: z.string().trim().min(2).optional(),
  description: z.string().trim().nullable().optional(),
  date: z.iso.datetime().optional(),
  type: z.string().trim().min(2).optional(),
  completed: z.boolean().optional(),
});

export type UpdateReminderInput = z.infer<
  typeof updateReminderSchema
>;
