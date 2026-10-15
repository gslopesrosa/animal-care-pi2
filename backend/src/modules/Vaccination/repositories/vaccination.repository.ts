
import { prisma } from "../../../database/prisma.js";
import type { CreateVaccinationInput } from "../schemas/create-vaccination.schema.js";

export class VaccinationRepository {
  async findPetByIdAndUserId(petId: number, userId: number) {
    return prisma.pet.findFirst({
      where: {
        id: petId,
        userId,
      },
    });
  }

  async create(petId: number, data: CreateVaccinationInput) {
    return prisma.vaccination.create({
      data: {
        vaccineName: data.vaccineName,
        applicationDate: new Date(data.applicationDate),
        nextDoseDate: data.nextDoseDate
          ? new Date(data.nextDoseDate)
          : undefined,
        responsible: data.responsible,
        petId,
      },
    });
  }

  async findByPetId(petId: number) {
    return prisma.vaccination.findMany({
      where: { petId },
      orderBy: { applicationDate: "desc" },
    });
  }

  
  async findByIdAndPetId(id: number, petId: number) {
    return prisma.vaccination.findFirst({
      where: {
        id,
        petId,
      },
    });
  }

  async updateByIdAndPetId(
    id: number,
    petId: number,
    data: import("../schemas/update-vaccination.schema.js").UpdateVaccinationInput,
  ) {
    const result = await prisma.vaccination.updateMany({
      where: {
        id,
        petId,
      },
      data: {
        ...data,
        applicationDate: data.applicationDate
          ? new Date(data.applicationDate)
          : undefined,
        nextDoseDate: data.nextDoseDate
          ? new Date(data.nextDoseDate)
          : data.nextDoseDate,
      },
    });

    if (result.count === 0) {
      return null;
    }

    return prisma.vaccination.findFirst({
      where: {
        id,
        petId,
      },
    });
  }

  async deleteByIdAndPetId(id: number, petId: number) {
    const result = await prisma.vaccination.deleteMany({
      where: {
        id,
        petId,
      },
    });

    return result.count > 0;
  }

}
