import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository.js";
import type { CreateUserInput } from "../schemas/create-user.schema.js";

export class CreateUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: CreateUserInput) {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error("E-mail já cadastrado");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}