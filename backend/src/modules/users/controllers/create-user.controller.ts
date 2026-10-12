
import type { Request, Response } from "express";
import { ZodError } from "zod";

import { createUserSchema } from "../schemas/create-user.schema.js";
import { UserRepository } from "../repositories/user.repository.js";
import { CreateUserService } from "../services/create-user.service.js";

export class CreateUserController {
  async handle(req: Request, res: Response) {
    try {
      const data = createUserSchema.parse(req.body);

      const userRepository = new UserRepository();
      const createUserService = new CreateUserService(userRepository);

      const user = await createUserService.execute(data);

      return res.status(201).json(user);
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
        error.message === "E-mail já cadastrado"
      ) {
        return res.status(409).json({
          message: error.message,
        });
      }
      
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
      ) {
        return res.status(409).json({
          message: "E-mail já cadastrado.",
        });
      }

      console.error("Erro ao cadastrar usuário:", error);

      return res.status(500).json({
        message: "Erro interno ao cadastrar usuário.",
      });
    }
  }
}