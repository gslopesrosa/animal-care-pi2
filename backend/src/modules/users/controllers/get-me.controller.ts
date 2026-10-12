
import type { Response } from "express";

import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { UserRepository } from "../repositories/user.repository.js";

export class GetMeController {
  async handle(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          message: "Usuário não autenticado.",
        });
      }

      const userRepository = new UserRepository();

      const user = await userRepository.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          message: "Usuário não encontrado.",
        });
      }

      return res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      });
    } catch (error: unknown) {
      console.error("Erro ao buscar usuário autenticado:", error);

      return res.status(500).json({
        message: "Erro interno ao buscar usuário.",
      });
    }
  }
}