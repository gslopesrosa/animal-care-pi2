
import type { Response } from "express";
import { ZodError } from "zod";
import type { AuthenticatedRequest } from "../../users/middlewares/auth.middleware.js";
import { PetRepository } from "../repositories/pet.repository.js";
import { CreatePetService } from "../services/create-pet.service.js";
import { createPetSchema } from "../schemas/create-pet.schema.js";

export class CreatePetController {
  async handle(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          message: "Usuário não autenticado.",
        });
      }

      const data = createPetSchema.parse(req.body);
      const userId = Number(req.userId);

      if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(401).json({
          message: "Usuário autenticado inválido.",
        });
      }

      const petRepository = new PetRepository();
      const createPetService = new CreatePetService(petRepository);

      const pet = await createPetService.execute(data, userId);

      return res.status(201).json(pet);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Dados inválidos.",
          errors: error.issues,
        });
      }

      console.error("Erro ao cadastrar pet:", error);

      return res.status(500).json({
        message: "Erro interno ao cadastrar pet.",
      });
    }
  }
}