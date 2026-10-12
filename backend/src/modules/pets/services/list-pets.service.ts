
import { PetRepository } from "../repositories/pet.repository.js";

export class ListPetsService {
  constructor(
    private readonly petRepository: PetRepository,
  ) {}

  async execute(userId: number) {
    return this.petRepository.findByUserId(userId);
  }
}