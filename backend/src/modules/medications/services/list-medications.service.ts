
import { MedicationRepository } from "../repositories/medication.repository.js";

export class ListMedicationsService {
  constructor(
    private readonly medicationRepository: MedicationRepository,
  ) {}

  async execute(petId: number, userId: number) {
    const pet = await this.medicationRepository.findPetByIdAndUserId(
      petId,
      userId,
    );

    if (!pet) {
      return null;
    }

    return this.medicationRepository.findByPetId(petId);
  }
}
