
import type { Request, Response } from "express";
import { ZodError } from "zod";

import { authenticateUserSchema } from "../schemas/authenticate-user.schema.js";
import { UserRepository } from "../repositories/user.repository.js";
import { AuthenticateUserService } from "../services/authenticate-user.service.js";

export class AuthenticateUserController {
  async handle(req: Request, res: Response) {
    try {
      const data = authenticateUserSchema.parse(req.body);

      const userRepository = new UserRepository();
      const authenticateUserService = new AuthenticateUserService(
        userRepository
      );

      const result = await authenticateUserService.execute(data);

      return res.status(200).json(result);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Dados inválidos.",
          errors: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      if (
        error instanceof Error &&
        error.message === "E-mail ou senha inválidos"
      ) {
        return res.status(401).json({
          message: "E-mail ou senha inválidos.",
        });
      }

      console.error("Erro ao autenticar usuário:", error);

      return res.status(500).json({
        message: "Erro interno ao autenticar usuário.",
      });
    }
  }
}