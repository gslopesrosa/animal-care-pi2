
import { z } from "zod";
import { createPetSchema } from "./create-pet.schema.js";

export const updatePetSchema = createPetSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "Informe pelo menos um campo para atualizar.",
  );

export type UpdatePetInput = z.infer<typeof updatePetSchema>;