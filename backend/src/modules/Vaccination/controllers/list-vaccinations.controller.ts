
import type { Response } from "express";
import type { AuthenticatedRequest } from "../../users/middlewares/auth.middleware.js";
import { VaccinationRepository } from "../repositories/vaccination.repository.js";
import { ListVaccinationsService } from "../services/list-vaccinations.service.js";

export class ListVaccinationsController {
  async handle(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = Number(req.userId);
      const petId = Number(req.params.petId);

      if (!req.userId || !Number.isInteger(userId) || userId <= 0) {
        return res.status(401).json({
          message: "Usuário não autenticado ou inválido.",
        });
      }

      if (!Number.isInteger(petId) || petId <= 0) {
        return res.status(400).json({
          message: "ID do pet inválido.",
        });
      }

      const repository = new VaccinationRepository();
      const service = new ListVaccinationsService(repository);
      const vaccinations = await service.execute(petId, userId);

      if (vaccinations === null) {
        return res.status(404).json({
          message: "Pet não encontrado.",
        });
      }

      return res.status(200).json(vaccinations);
    } catch (error: unknown) {
      console.error("Erro ao listar vacinações:", error);

      return res.status(500).json({
        message: "Erro interno ao listar vacinações.",
      });
    }
  }
}
