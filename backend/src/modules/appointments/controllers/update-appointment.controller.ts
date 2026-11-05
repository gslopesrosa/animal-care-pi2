
import type { Response } from "express";
import { ZodError } from "zod";
import type { AuthenticatedRequest } from "../../users/middlewares/auth.middleware.js";
import { AppointmentRepository } from "../repositories/appointment.repository.js";
import { updateAppointmentSchema } from "../schemas/update-appointment.schema.js";
import { UpdateAppointmentService } from "../services/update-appointment.service.js";

export class UpdateAppointmentController {
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

      const data = updateAppointmentSchema.parse(req.body);

      if (Object.keys(data).length === 0) {
        return res.status(400).json({
          message: "Informe pelo menos um campo para atualizar.",
        });
      }

      const repository = new AppointmentRepository();
      const service = new UpdateAppointmentService(repository);

      const appointment = await service.execute(
        petId,
        userId,
        id,
        data,
      );

      if (!appointment) {
        return res.status(404).json({
          message: "Pet ou consulta não encontrado.",
        });
      }

      return res.status(200).json(appointment);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Dados inválidos.",
          errors: error.issues,
        });
      }

      console.error("Erro ao atualizar consulta:", error);

      return res.status(500).json({
        message: "Erro interno ao atualizar consulta.",
      });
    }
  }
}
