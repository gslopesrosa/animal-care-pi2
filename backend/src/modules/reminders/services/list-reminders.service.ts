
import { ReminderRepository } from "../repositories/reminder.repository.js";

export class ListRemindersService {
  constructor(
    private readonly reminderRepository: ReminderRepository,
  ) {}

  async execute(petId: number, userId: number) {
    const pet =
      await this.reminderRepository.findPetByIdAndUserId(
        petId,
        userId,
      );

    if (!pet) return null;

    return this.reminderRepository.findByPetId(petId);
  }
}
