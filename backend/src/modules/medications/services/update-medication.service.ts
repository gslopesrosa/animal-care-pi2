
import { MedicationRepository } from "../repositories/medication.repository.js";
import type { UpdateMedicationInput } from "../schemas/update-medication.schema.js";

export class UpdateMedicationService {
  constructor(
    private readonly medicationRepository: MedicationRepository,
  ) {}

  async execute(
    petId: number,
    userId: number,
    id: number,
    data: UpdateMedicationInput,
  ) {
    const pet = await this.medicationRepository.findPetByIdAndUserId(
      petId,
      userId,
    );

    if (!pet) {
      return null;
    }

    return this.medicationRepository.updateByIdAndPetId(id, petId, data);
  }
}
