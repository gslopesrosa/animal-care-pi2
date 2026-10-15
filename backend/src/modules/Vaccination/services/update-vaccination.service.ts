
import { VaccinationRepository } from "../repositories/vaccination.repository.js";
import type { UpdateVaccinationInput } from "../schemas/update-vaccination.schema.js";

export class UpdateVaccinationService {
  constructor(
    private readonly vaccinationRepository: VaccinationRepository,
  ) {}

  async execute(
    id: number,
    petId: number,
    userId: number,
    data: UpdateVaccinationInput,
  ) {
    const pet = await this.vaccinationRepository.findPetByIdAndUserId(
      petId,
      userId,
    );

    if (!pet) {
      return null;
    }

    return this.vaccinationRepository.updateByIdAndPetId(
      id,
      petId,
      data,
    );
  }
}
