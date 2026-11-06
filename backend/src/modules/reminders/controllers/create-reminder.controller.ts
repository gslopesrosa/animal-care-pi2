import type { Response } from "express";
import { ZodError } from "zod";
import type { AuthenticatedRequest } from "../../users/middlewares/auth.middleware.js";
import { ReminderRepository } from "../repositories/reminder.repository.js";
import { createReminderSchema } from "../schemas/create-reminder.schema.js";
import { CreateReminderService } from "../services/create-reminder.service.js";

export class CreateReminderController {
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

      const data = createReminderSchema.parse(req.body);

      const repository = new ReminderRepository();
      const service = new CreateReminderService(repository);

      const reminder = await service.execute(
        petId,
        userId,
        data,
      );

      if (!reminder) {
        return res.status(404).json({
          message: "Pet não encontrado.",
        });
      }

      return res.status(201).json(reminder);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Dados inválidos.",
          errors: error.issues,
        });
      }

      console.error("Erro ao cadastrar lembrete:", error);

      return res.status(500).json({
        message: "Erro interno ao cadastrar lembrete.",
      });
    }
  }
}