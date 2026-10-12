
import type { Response } from "express";
import { ZodError } from "zod";
import type { AuthenticatedRequest } from "../../users/middlewares/auth.middleware.js";
import { PetRepository } from "../repositories/pet.repository.js";
import { UpdatePetService } from "../services/update-pet.service.js";
import { updatePetSchema } from "../schemas/update-pet.schema.js";

export class UpdatePetController {
  async handle(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          message: "Usuário não autenticado.",
        });
      }

      const id = Number(req.params.id);
      const userId = Number(req.userId);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          message: "ID do pet inválido.",
        });
      }

      if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(401).json({
          message: "Usuário autenticado inválido.",
        });
      }

      const data = updatePetSchema.parse(req.body);

      const petRepository = new PetRepository();
      const updatePetService = new UpdatePetService(petRepository);

      const pet = await updatePetService.execute(
        id,
        userId,
        data,
      );

      if (!pet) {
        return res.status(404).json({
          message: "Pet não encontrado.",
        });
      }

      return res.status(200).json(pet);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Dados inválidos.",
          errors: error.issues,
        });
      }

      console.error("Erro ao atualizar pet:", error);

      return res.status(500).json({
        message: "Erro interno ao atualizar pet.",
      });
    }
  }
}