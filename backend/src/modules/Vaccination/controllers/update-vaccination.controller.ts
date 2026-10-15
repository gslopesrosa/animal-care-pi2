
import type { Response } from "express";
import { ZodError } from "zod";
import type { AuthenticatedRequest } from "../../users/middlewares/auth.middleware.js";
import { VaccinationRepository } from "../repositories/vaccination.repository.js";
import { updateVaccinationSchema } from "../schemas/update-vaccination.schema.js";
import { UpdateVaccinationService } from "../services/update-vaccination.service.js";

export class UpdateVaccinationController {
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

      const data = updateVaccinationSchema.parse(req.body);
      const repository = new VaccinationRepository();
      const service = new UpdateVaccinationService(repository);

      const vaccination = await service.execute(
        id,
        petId,
        userId,
        data,
      );

      if (!vaccination) {
        return res.status(404).json({
          message: "Pet ou vacina não encontrado.",
        });
      }

      return res.status(200).json(vaccination);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Dados inválidos.",
          errors: error.issues,
        });
      }

      console.error("Erro ao atualizar vacinação:", error);

      return res.status(500).json({
        message: "Erro interno ao atualizar vacinação.",
      });
    }
  }
}
