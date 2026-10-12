
import { prisma } from "../../../database/prisma.js";
import type { UpdatePetInput } from "../schemas/update-pet.schema.js";

export class PetRepository {
  async create(data: {
    name: string;
    species: string;
    breed?: string;
    sex?: string;
    birthDate?: Date;
    weight?: number;
    photoUrl?: string;
    userId: number;
  }) {
    return prisma.pet.create({
      data: {
        name: data.name,
        species: data.species,
        breed: data.breed,
        sex: data.sex,
        birthDate: data.birthDate,
        weight: data.weight,
        photoUrl: data.photoUrl,
        userId: data.userId,
      },
    });
  }

  async findByUserId(userId: number) {
    return prisma.pet.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByIdAndUserId(id: number, userId: number) {
    return prisma.pet.findFirst({
      where: { id, userId },
    });
  }

  async updateByIdAndUserId(
    id: number,
    userId: number,
    data: UpdatePetInput,
  ) {
    const result = await prisma.pet.updateMany({
      where: { id, userId },
      data: {
        ...data,
        birthDate: data.birthDate
          ? new Date(data.birthDate)
          : data.birthDate,
      },
    });

    if (result.count === 0) {
      return null;
    }

    return prisma.pet.findFirst({
      where: { id, userId },
    });
  }

  async deleteByIdAndUserId(id: number, userId: number) {
    const result = await prisma.pet.deleteMany({
      where: { id, userId },
    });

    return result.count > 0;
  }
}