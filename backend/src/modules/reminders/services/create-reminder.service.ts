
import { ReminderRepository } from "../repositories/reminder.repository.js";
import type { CreateReminderInput } from "../schemas/create-reminder.schema.js";

export class CreateReminderService {
  constructor(
    private readonly reminderRepository: ReminderRepository,
  ) {}

  async execute(
    petId: number,
    userId: number,
    data: CreateReminderInput,
  ) {
    const pet =
      await this.reminderRepository.findPetByIdAndUserId(
        petId,
        userId,
      );

    if (!pet) return null;

    return this.reminderRepository.create(petId, data);
  }
}
