
import type { Response } from "express";
import type { AuthenticatedRequest } from "../../users/middlewares/auth.middleware.js";
import { PetRepository } from "../repositories/pet.repository.js";
import { ListPetsService } from "../services/list-pets.service.js";

export class ListPetsController {
  async handle(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          message: "Usuário não autenticado.",
        });
      }

      const userId = Number(req.userId);

      if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(401).json({
          message: "Usuário autenticado inválido.",
        });
      }

      const petRepository = new PetRepository();
      const listPetsService = new ListPetsService(petRepository);

      const pets = await listPetsService.execute(userId);

      return res.status(200).json(pets);
    } catch (error: unknown) {
      console.error("Erro ao listar pets:", error);

      return res.status(500).json({
        message: "Erro interno ao listar pets.",
      });
    }
  }
}