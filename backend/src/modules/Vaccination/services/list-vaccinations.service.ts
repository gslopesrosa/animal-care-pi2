
import { VaccinationRepository } from "../repositories/vaccination.repository.js";

export class ListVaccinationsService {
  constructor(
    private readonly vaccinationRepository: VaccinationRepository,
  ) {}

  async execute(petId: number, userId: number) {
    const pet = await this.vaccinationRepository.findPetByIdAndUserId(
      petId,
      userId,
    );

    if (!pet) {
      return null;
    }

    return this.vaccinationRepository.findByPetId(petId);
  }
}
