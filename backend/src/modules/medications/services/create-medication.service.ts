
import { MedicationRepository } from "../repositories/medication.repository.js";
import type { CreateMedicationInput } from "../schemas/create-medication.schema.js";

export class CreateMedicationService {
  constructor(
    private readonly medicationRepository: MedicationRepository,
  ) {}

  async execute(petId: number, userId: number, data: CreateMedicationInput) {
    const pet = await this.medicationRepository.findPetByIdAndUserId(
      petId,
      userId,
    );

    if (!pet) {
      return null;
    }

    return this.medicationRepository.create(petId, data);
  }
}
