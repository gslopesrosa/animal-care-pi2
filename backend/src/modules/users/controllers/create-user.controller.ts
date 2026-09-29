import type { Request, Response } from "express";
import {
  createUserSchema,
} from "../schemas/create-user.schema.js";
import { UserRepository } from "../repositories/user.repository.js";
import { CreateUserService } from "../services/create-user.service.js";

export class CreateUserController {
  async handle(req: Request, res: Response) {
    const data = createUserSchema.parse(req.body);

    const userRepository = new UserRepository();

    const createUserService = new CreateUserService(
      userRepository
    );

    const user = await createUserService.execute(data);

    return res.status(201).json(user);
  }
}