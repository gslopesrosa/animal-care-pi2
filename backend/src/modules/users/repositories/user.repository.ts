import { prisma } from "../../../database/prisma.js";

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
  }) {
    return prisma.user.create({
      data,
    });
  }
}