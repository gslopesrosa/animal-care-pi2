
import { prisma } from "../../../database/prisma.js";
import type { CreateMedicationInput } from "../schemas/create-medication.schema.js";
import type { UpdateMedicationInput } from "../schemas/update-medication.schema.js";

export class MedicationRepository {
  async findPetByIdAndUserId(petId: number, userId: number) {
    return prisma.pet.findFirst({
      where: { id: petId, userId },
    });
  }

  async create(petId: number, data: CreateMedicationInput) {
    return prisma.medication.create({
      data: {
        name: data.name,
        dosage: data.dosage,
        frequency: data.frequency,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        notes: data.notes,
        petId,
      },
    });
  }

  async findByPetId(petId: number) {
    return prisma.medication.findMany({
      where: { petId },
      orderBy: { startDate: "desc" },
    });
  }

  async findByIdAndPetId(id: number, petId: number) {
    return prisma.medication.findFirst({
      where: { id, petId },
    });
  }

  async updateByIdAndPetId(
    id: number,
    petId: number,
    data: UpdateMedicationInput,
  ) {
    const result = await prisma.medication.updateMany({
      where: { id, petId },
      data: {
        ...data,
        startDate: data.startDate
          ? new Date(data.startDate)
          : undefined,
        endDate:
          data.endDate === undefined
            ? undefined
            : data.endDate === null
              ? null
              : new Date(data.endDate),
      },
    });

    if (result.count === 0) {
      return null;
    }

    return prisma.medication.findFirst({
      where: { id, petId },
    });
  }

  async deleteByIdAndPetId(id: number, petId: number) {
    const result = await prisma.medication.deleteMany({
      where: { id, petId },
    });

    return result.count > 0;
  }
}
