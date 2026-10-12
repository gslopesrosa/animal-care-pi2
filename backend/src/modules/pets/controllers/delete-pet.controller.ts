
import type { Response } from "express";
import type { AuthenticatedRequest } from "../../users/middlewares/auth.middleware.js";
import { PetRepository } from "../repositories/pet.repository.js";
import { DeletePetService } from "../services/delete-pet.service.js";

export class DeletePetController {
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

      const petRepository = new PetRepository();
      const deletePetService = new DeletePetService(petRepository);

      const deleted = await deletePetService.execute(id, userId);

      if (!deleted) {
        return res.status(404).json({
          message: "Pet não encontrado.",
        });
      }

      return res.status(204).send();
    } catch (error: unknown) {
      console.error("Erro ao excluir pet:", error);

      return res.status(500).json({
        message: "Erro interno ao excluir pet.",
      });
    }
  }
}