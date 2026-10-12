
import { PetRepository } from "../repositories/pet.repository.js";
import type { UpdatePetInput } from "../schemas/update-pet.schema.js";

export class UpdatePetService {
  constructor(
    private readonly petRepository: PetRepository,
  ) {}

  async execute(
    id: number,
    userId: number,
    data: UpdatePetInput,
  ) {
    return this.petRepository.updateByIdAndUserId(
      id,
      userId,
      data,
    );
  }
}