
import { PetRepository } from "../repositories/pet.repository.js";

export class GetPetService {
  constructor(
    private readonly petRepository: PetRepository,
  ) {}

  async execute(id: number, userId: number) {
    return this.petRepository.findByIdAndUserId(id, userId);
  }
}