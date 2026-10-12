
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserRepository } from "../repositories/user.repository.js";
import type { AuthenticateUserInput } from "../schemas/authenticate-user.schema.js";

export class AuthenticateUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: AuthenticateUserInput) {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new Error("E-mail ou senha inválidos");
    }

    const passwordMatches = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!passwordMatches) {
      throw new Error("E-mail ou senha inválidos");
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET não configurada");
    }

    const token = jwt.sign(
      {
        sub: user.id,
      },
      secret,
      {
        expiresIn: "1d",
      }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }
}