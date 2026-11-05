
import { prisma } from "../../../database/prisma.js";
import type { CreateAppointmentInput } from "../schemas/create-appointment.schema.js";
import type { UpdateAppointmentInput } from "../schemas/update-appointment.schema.js";

export class AppointmentRepository {
  async findPetByIdAndUserId(petId: number, userId: number) {
    return prisma.pet.findFirst({
      where: { id: petId, userId },
    });
  }

  async create(petId: number, data: CreateAppointmentInput) {
    return prisma.veterinaryAppointment.create({
      data: {
        date: new Date(data.date),
        clinic: data.clinic,
        veterinarian: data.veterinarian,
        diagnosis: data.diagnosis,
        notes: data.notes,
        petId,
      },
    });
  }

  async findByPetId(petId: number) {
    return prisma.veterinaryAppointment.findMany({
      where: { petId },
      orderBy: { date: "desc" },
    });
  }

  async findByIdAndPetId(id: number, petId: number) {
    return prisma.veterinaryAppointment.findFirst({
      where: { id, petId },
    });
  }

  async updateByIdAndPetId(
    id: number,
    petId: number,
    data: UpdateAppointmentInput,
  ) {
    const result = await prisma.veterinaryAppointment.updateMany({
      where: { id, petId },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
    });

    if (result.count === 0) {
      return null;
    }

    return prisma.veterinaryAppointment.findFirst({
      where: { id, petId },
    });
  }

  async deleteByIdAndPetId(id: number, petId: number) {
    const result = await prisma.veterinaryAppointment.deleteMany({
      where: { id, petId },
    });

    return result.count > 0;
  }
}
