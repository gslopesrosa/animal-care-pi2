import type { Response } from "express";
import { ZodError } from "zod";
import type { AuthenticatedRequest } from "../../users/middlewares/auth.middleware.js";
import { ReminderRepository } from "../repositories/reminder.repository.js";
import { updateReminderSchema } from "../schemas/update-reminder.schema.js";
import { UpdateReminderService } from "../services/update-reminder.service.js";

export class UpdateReminderController {
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

      const data = updateReminderSchema.parse(req.body);

      if (Object.keys(data).length === 0) {
        return res.status(400).json({
          message: "Informe pelo menos um campo para atualizar.",
        });
      }

      const repository = new ReminderRepository();
      const service = new UpdateReminderService(repository);

      const reminder = await service.execute(
        petId,
        userId,
        id,
        data,
      );

      if (!reminder) {
        return res.status(404).json({
          message: "Pet ou lembrete não encontrado.",
        });
      }

      return res.status(200).json(reminder);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Dados inválidos.",
          errors: error.issues,
        });
      }

      console.error("Erro ao atualizar lembrete:", error);

      return res.status(500).json({
        message: "Erro interno ao atualizar lembrete.",
      });
    }
  }
}