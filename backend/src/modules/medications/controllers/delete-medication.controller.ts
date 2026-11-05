
import type { Response } from "express";
import type { AuthenticatedRequest } from "../../users/middlewares/auth.middleware.js";
import { MedicationRepository } from "../repositories/medication.repository.js";
import { DeleteMedicationService } from "../services/delete-medication.service.js";

export class DeleteMedicationController {
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

      const repository = new MedicationRepository();
      const service = new DeleteMedicationService(repository);

      const deleted = await service.execute(petId, userId, id);

      if (!deleted) {
        return res.status(404).json({
          message: "Pet ou medicamento não encontrado.",
        });
      }

      return res.status(200).json({
        message: "Medicamento excluído com sucesso.",
      });
    } catch (error: unknown) {
      console.error("Erro ao excluir medicamento:", error);

      return res.status(500).json({
        message: "Erro interno ao excluir medicamento.",
      });
    }
  }
}
