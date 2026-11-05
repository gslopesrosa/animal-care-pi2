
import type { Response } from "express";
import { ZodError } from "zod";
import type { AuthenticatedRequest } from "../../users/middlewares/auth.middleware.js";
import { AppointmentRepository } from "../repositories/appointment.repository.js";
import { createAppointmentSchema } from "../schemas/create-appointment.schema.js";
import { CreateAppointmentService } from "../services/create-appointment.service.js";

export class CreateAppointmentController {
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

      const data = createAppointmentSchema.parse(req.body);

      const repository = new AppointmentRepository();
      const service = new CreateAppointmentService(repository);

      const appointment = await service.execute(petId, userId, data);

      if (!appointment) {
        return res.status(404).json({
          message: "Pet não encontrado.",
        });
      }

      return res.status(201).json(appointment);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Dados inválidos.",
          errors: error.issues,
        });
      }

      console.error("Erro ao cadastrar consulta:", error);

      return res.status(500).json({
        message: "Erro interno ao cadastrar consulta.",
      });
    }
  }
}
