
import type { Response } from "express";
import { ZodError } from "zod";
import type { AuthenticatedRequest } from "../../users/middlewares/auth.middleware.js";
import { VaccinationRepository } from "../repositories/vaccination.repository.js";
import { createVaccinationSchema } from "../schemas/create-vaccination.schema.js";
import { CreateVaccinationService } from "../services/create-vaccination.service.js";

export class CreateVaccinationController {
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

      const data = createVaccinationSchema.parse(req.body);
      const repository = new VaccinationRepository();
      const service = new CreateVaccinationService(repository);

      const vaccination = await service.execute(petId, userId, data);

      if (!vaccination) {
        return res.status(404).json({
          message: "Pet não encontrado.",
        });
      }

      return res.status(201).json(vaccination);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Dados inválidos.",
          errors: error.issues,
        });
      }

      console.error("Erro ao cadastrar vacinação:", error);

      return res.status(500).json({
        message: "Erro interno ao cadastrar vacinação.",
      });
    }
  }
}
