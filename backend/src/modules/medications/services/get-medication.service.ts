
import { MedicationRepository } from "../repositories/medication.repository.js";

export class GetMedicationService {
  constructor(
    private readonly medicationRepository: MedicationRepository,
  ) {}

  async execute(petId: number, userId: number, id: number) {
    const pet = await this.medicationRepository.findPetByIdAndUserId(
      petId,
      userId,
    );

    if (!pet) {
      return null;
    }

    return this.medicationRepository.findByIdAndPetId(id, petId);
  }
}
