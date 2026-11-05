
import type { Response } from "express";
import type { AuthenticatedRequest } from "../../users/middlewares/auth.middleware.js";
import { AppointmentRepository } from "../repositories/appointment.repository.js";
import { DeleteAppointmentService } from "../services/delete-appointment.service.js";

export class DeleteAppointmentController {
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
          message: "ID da consulta inválido.",
        });
      }

      const repository = new AppointmentRepository();
      const service = new DeleteAppointmentService(repository);

      const deleted = await service.execute(petId, userId, id);

      if (!deleted) {
        return res.status(404).json({
          message: "Pet ou consulta não encontrado.",
        });
      }

      return res.status(200).json({
        message: "Consulta excluída com sucesso.",
      });
    } catch (error: unknown) {
      console.error("Erro ao excluir consulta:", error);

      return res.status(500).json({
        message: "Erro interno ao excluir consulta.",
      });
    }
  }
}
