
import { VaccinationRepository } from "../repositories/vaccination.repository.js";

export class GetVaccinationService {
  constructor(
    private readonly vaccinationRepository: VaccinationRepository,
  ) {}

  async execute(id: number, petId: number, userId: number) {
    const pet = await this.vaccinationRepository.findPetByIdAndUserId(
      petId,
      userId,
    );

    if (!pet) {
      return null;
    }

    return this.vaccinationRepository.findByIdAndPetId(id, petId);
  }
}
