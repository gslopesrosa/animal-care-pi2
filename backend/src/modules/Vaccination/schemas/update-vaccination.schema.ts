
import { z } from "zod";
import { createVaccinationSchema } from "./create-vaccination.schema.js";

export const updateVaccinationSchema = createVaccinationSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "Informe pelo menos um campo para atualizar.",
  );

export type UpdateVaccinationInput = z.infer<
  typeof updateVaccinationSchema
>;
