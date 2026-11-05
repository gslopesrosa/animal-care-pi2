
import type { Response } from "express";
import { ZodError } from "zod";
import type { AuthenticatedRequest } from "../../users/middlewares/auth.middleware.js";
import { MedicationRepository } from "../repositories/medication.repository.js";
import { updateMedicationSchema } from "../schemas/update-medication.schema.js";
import { UpdateMedicationService } from "../services/update-medication.service.js";

export class UpdateMedicationController {
  async handle(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = Number(req.userId);
      const petId = Number(req.params.petId);
      const id = Number(req.params.id);

      if (!req.userId || !Number.isInteger(userId) || userId <= 0) {
        return res.status(401).json({
          message: "Usuário não autenticado ou inválido.",
        });
      }

      if (!Number.isInteger(petId) || petId <= 0) {
        return res.status(400).json({ message: "ID do pet inválido." });
      }

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          message: "ID do medicamento inválido.",
        });
      }

      const data = updateMedicationSchema.parse(req.body);

      if (Object.keys(data).length === 0) {
        return res.status(400).json({
          message: "Informe pelo menos um campo para atualizar.",
        });
      }

      const repository = new MedicationRepository();
      const service = new UpdateMedicationService(repository);

      const medication = await service.execute(petId, userId, id, data);

      if (!medication) {
        return res.status(404).json({
          message: "Pet ou medicamento não encontrado.",
        });
      }

      return res.status(200).json(medication);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Dados inválidos.",
          errors: error.issues,
        });
      }

      console.error("Erro ao atualizar medicamento:", error);

      return res.status(500).json({
        message: "Erro interno ao atualizar medicamento.",
      });
    }
  }
}
