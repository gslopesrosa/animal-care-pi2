import type { Response } from "express";
import type { AuthenticatedRequest } from "../../users/middlewares/auth.middleware.js";
import { ReminderRepository } from "../repositories/reminder.repository.js";
import { ListRemindersService } from "../services/list-reminders.service.js";

export class ListRemindersController {
  async handle(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = Number(req.userId);
      const petId = Number(req.params.petId);

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

      const repository = new ReminderRepository();
      const service = new ListRemindersService(repository);

      const reminders = await service.execute(petId, userId);

      if (!reminders) {
        return res.status(404).json({
          message: "Pet não encontrado.",
        });
      }

      return res.status(200).json(reminders);
    } catch (error) {
      console.error("Erro ao listar lembretes:", error);

      return res.status(500).json({
        message: "Erro interno ao listar lembretes.",
      });
    }
  }
}