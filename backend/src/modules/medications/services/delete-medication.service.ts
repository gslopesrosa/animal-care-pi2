
import { MedicationRepository } from "../repositories/medication.repository.js";

export class DeleteMedicationService {
  constructor(
    private readonly medicationRepository: MedicationRepository,
  ) {}

  async execute(petId: number, userId: number, id: number) {
    const pet = await this.medicationRepository.findPetByIdAndUserId(
      petId,
      userId,
    );

    if (!pet) {
      return false;
    }

    return this.medicationRepository.deleteByIdAndPetId(id, petId);
  }
}
