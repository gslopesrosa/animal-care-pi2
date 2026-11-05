
import type { Response } from "express";
import type { AuthenticatedRequest } from "../../users/middlewares/auth.middleware.js";
import { MedicationRepository } from "../repositories/medication.repository.js";
import { ListMedicationsService } from "../services/list-medications.service.js";

export class ListMedicationsController {
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

      const repository = new MedicationRepository();
      const service = new ListMedicationsService(repository);

      const medications = await service.execute(petId, userId);

      if (!medications) {
        return res.status(404).json({
          message: "Pet não encontrado.",
        });
      }

      return res.status(200).json(medications);
    } catch (error: unknown) {
      console.error("Erro ao listar medicamentos:", error);

      return res.status(500).json({
        message: "Erro interno ao listar medicamentos.",
      });
    }
  }
}
