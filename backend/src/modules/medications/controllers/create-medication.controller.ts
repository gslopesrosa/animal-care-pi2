
import type { Response } from "express";
import { ZodError } from "zod";
import type { AuthenticatedRequest } from "../../users/middlewares/auth.middleware.js";
import { MedicationRepository } from "../repositories/medication.repository.js";
import { createMedicationSchema } from "../schemas/create-medication.schema.js";
import { CreateMedicationService } from "../services/create-medication.service.js";

export class CreateMedicationController {
  async handle(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = Number(req.userId);
      const petId = Number(req.params.petId);

      if (
        !req.userId ||
        !Number.isInteger(userId) ||
        userId <= 0
      ) {
        return res.status(401).json({
          message: "Usuário não autenticado ou inválido.",
        });
      }

      if (!Number.isInteger(petId) || petId <= 0) {
        return res.status(400).json({
          message: "ID do pet inválido.",
        });
      }

      const data = createMedicationSchema.parse(req.body);

      const repository = new MedicationRepository();
      const service = new CreateMedicationService(repository);

      const medication = await service.execute(
        petId,
        userId,
        data,
      );

      if (!medication) {
        return res.status(404).json({
          message: "Pet não encontrado.",
        });
      }

      return res.status(201).json(medication);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Dados inválidos.",
          errors: error.issues,
        });
      }

      console.error("Erro ao cadastrar medicamento:", error);

      return res.status(500).json({
        message: "Erro interno ao cadastrar medicamento.",
      });
    }
  }
}
