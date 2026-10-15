
import type { Response } from "express";
import type { AuthenticatedRequest } from "../../users/middlewares/auth.middleware.js";
import { VaccinationRepository } from "../repositories/vaccination.repository.js";
import { DeleteVaccinationService } from "../services/delete-vaccination.service.js";

export class DeleteVaccinationController {
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

      if (
        !Number.isInteger(petId) || petId <= 0 ||
        !Number.isInteger(id) || id <= 0
      ) {
        return res.status(400).json({
          message: "ID do pet ou da vacina inválido.",
        });
      }

      const repository = new VaccinationRepository();
      const service = new DeleteVaccinationService(repository);
      const deleted = await service.execute(id, petId, userId);

      if (!deleted) {
        return res.status(404).json({
          message: "Pet ou vacina não encontrado.",
        });
      }

      return res.status(204).send();
    } catch (error: unknown) {
      console.error("Erro ao excluir vacinação:", error);

      return res.status(500).json({
        message: "Erro interno ao excluir vacinação.",
      });
    }
  }
}
