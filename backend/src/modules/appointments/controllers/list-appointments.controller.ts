
import type { Response } from "express";
import type { AuthenticatedRequest } from "../../users/middlewares/auth.middleware.js";
import { AppointmentRepository } from "../repositories/appointment.repository.js";
import { ListAppointmentsService } from "../services/list-appointments.service.js";

export class ListAppointmentsController {
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

      const repository = new AppointmentRepository();
      const service = new ListAppointmentsService(repository);

      const appointments = await service.execute(petId, userId);

      if (!appointments) {
        return res.status(404).json({
          message: "Pet não encontrado.",
        });
      }

      return res.status(200).json(appointments);
    } catch (error: unknown) {
      console.error("Erro ao listar consultas:", error);

      return res.status(500).json({
        message: "Erro interno ao listar consultas.",
      });
    }
  }
}
