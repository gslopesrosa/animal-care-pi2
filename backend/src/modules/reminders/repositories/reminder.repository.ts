
import { prisma } from "../../../database/prisma.js";
import type { CreateReminderInput } from "../schemas/create-reminder.schema.js";
import type { UpdateReminderInput } from "../schemas/update-reminder.schema.js";

export class ReminderRepository {
  async findPetByIdAndUserId(petId: number, userId: number) {
    return prisma.pet.findFirst({
      where: { id: petId, userId },
    });
  }

  async create(petId: number, data: CreateReminderInput) {
    return prisma.reminder.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        type: data.type,
        completed: data.completed ?? false,
        petId,
      },
    });
  }

  async findByPetId(petId: number) {
    return prisma.reminder.findMany({
      where: { petId },
      orderBy: { date: "asc" },
    });
  }

  async findByIdAndPetId(id: number, petId: number) {
    return prisma.reminder.findFirst({
      where: { id, petId },
    });
  }

  async updateByIdAndPetId(
    id: number,
    petId: number,
    data: UpdateReminderInput,
  ) {
    const result = await prisma.reminder.updateMany({
      where: { id, petId },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
    });

    if (result.count === 0) {
      return null;
    }

    return prisma.reminder.findFirst({
      where: { id, petId },
    });
  }

  async deleteByIdAndPetId(id: number, petId: number) {
    const result = await prisma.reminder.deleteMany({
      where: { id, petId },
    });

    return result.count > 0;
  }
}
