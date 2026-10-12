
import type { Response } from "express";
import type { AuthenticatedRequest } from "../../users/middlewares/auth.middleware.js";
import { PetRepository } from "../repositories/pet.repository.js";
import { GetPetService } from "../services/get-pet.service.js";

export class GetPetController {
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

      const petRepository = new PetRepository();
      const getPetService = new GetPetService(petRepository);

      const pet = await getPetService.execute(id, userId);

      if (!pet) {
        return res.status(404).json({
          message: "Pet não encontrado.",
        });
      }

      return res.status(200).json(pet);
    } catch (error: unknown) {
      console.error("Erro ao consultar pet:", error);

      return res.status(500).json({
        message: "Erro interno ao consultar pet.",
      });
    }
  }
}