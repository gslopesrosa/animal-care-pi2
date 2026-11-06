
import { ReminderRepository } from "../repositories/reminder.repository.js";

export class DeleteReminderService {
  constructor(
    private readonly reminderRepository: ReminderRepository,
  ) {}

  async execute(petId: number, userId: number, id: number) {
    const pet =
      await this.reminderRepository.findPetByIdAndUserId(
        petId,
        userId,
      );

    if (!pet) return false;

    return this.reminderRepository.deleteByIdAndPetId(
      id,
      petId,
    );
  }
}
