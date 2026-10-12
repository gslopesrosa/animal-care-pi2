
import { PetRepository } from "../repositories/pet.repository.js";
import type { CreatePetInput } from "../schemas/create-pet.schema.js";

export class CreatePetService {
  constructor(
    private readonly petRepository: PetRepository,
  ) {}

  async execute(data: CreatePetInput, userId: number) {
    const pet = await this.petRepository.create({
      name: data.name,
      species: data.species,
      breed: data.breed,
      sex: data.sex,
      birthDate: data.birthDate
        ? new Date(data.birthDate)
        : undefined,
      weight: data.weight,
      photoUrl: data.photoUrl,
      userId,
    });

    return pet;
  }
}