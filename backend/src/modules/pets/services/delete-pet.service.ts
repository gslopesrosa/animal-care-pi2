
import { PetRepository } from "../repositories/pet.repository.js";

export class DeletePetService {
  constructor(
    private readonly petRepository: PetRepository,
  ) {}

  async execute(id: number, userId: number) {
    return this.petRepository.deleteByIdAndUserId(id, userId);
  }
}