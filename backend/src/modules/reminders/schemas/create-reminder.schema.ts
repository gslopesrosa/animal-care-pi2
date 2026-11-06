
import { z } from "zod";

export const createReminderSchema = z.object({
  title: z.string().trim().min(2, "Informe o título do lembrete"),
  description: z.string().trim().optional(),
  date: z.iso.datetime({
    error: "Informe uma data e horário válidos",
  }),
  type: z.string().trim().min(2, "Informe o tipo do lembrete"),
  completed: z.boolean().optional(),
});

export type CreateReminderInput = z.infer<
  typeof createReminderSchema
>;
