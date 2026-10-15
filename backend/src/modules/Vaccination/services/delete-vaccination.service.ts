
import { VaccinationRepository } from "../repositories/vaccination.repository.js";

export class DeleteVaccinationService {
  constructor(
    private readonly vaccinationRepository: VaccinationRepository,
  ) {}

  async execute(id: number, petId: number, userId: number) {
    const pet = await this.vaccinationRepository.findPetByIdAndUserId(
      petId,
      userId,
    );

    if (!pet) {
      return false;
    }

    return this.vaccinationRepository.deleteByIdAndPetId(id, petId);
  }
}
