
import { VaccinationRepository } from "../repositories/vaccination.repository.js";
import type { CreateVaccinationInput } from "../schemas/create-vaccination.schema.js";

export class CreateVaccinationService {
  constructor(
    private readonly vaccinationRepository: VaccinationRepository,
  ) {}

  async execute(
    petId: number,
    userId: number,
    data: CreateVaccinationInput,
  ) {
    const pet = await this.vaccinationRepository.findPetByIdAndUserId(
      petId,
      userId,
    );

    if (!pet) {
      return null;
    }

    return this.vaccinationRepository.create(petId, data);
  }
}
