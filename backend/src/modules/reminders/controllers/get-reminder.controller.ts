import type { Response } from "express";
import type { AuthenticatedRequest } from "../../users/middlewares/auth.middleware.js";
import { ReminderRepository } from "../repositories/reminder.repository.js";
import { GetReminderService } from "../services/get-reminder.service.js";

export class GetReminderController {
  async handle(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = Number(req.userId);
      const petId = Number(req.params.petId);
      const id = Number(req.params.id);

      if (!req.userId || !Number.isInteger(userId) || userId <= 0) {
        return res.status(401).json({
          message: "Usuário não autenticado.",
        });
      }

      if (!Number.isInteger(petId) || petId <= 0) {
        return res.status(400).json({
          message: "ID do pet inválido.",
        });
      }

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          message: "ID do lembrete inválido.",
        });
      }

      const repository = new ReminderRepository();
      const service = new GetReminderService(repository);

      const reminder = await service.execute(petId, userId, id);

      if (!reminder) {
        return res.status(404).json({
          message: "Lembrete não encontrado.",
        });
      }

      return res.status(200).json(reminder);
    } catch (error) {
      console.error("Erro ao buscar lembrete:", error);

      return res.status(500).json({
        message: "Erro interno ao buscar lembrete.",
      });
    }
  }
}