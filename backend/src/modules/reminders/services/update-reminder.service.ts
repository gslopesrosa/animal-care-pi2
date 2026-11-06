
import { ReminderRepository } from "../repositories/reminder.repository.js";
import type { UpdateReminderInput } from "../schemas/update-reminder.schema.js";

export class UpdateReminderService {
  constructor(
    private readonly reminderRepository: ReminderRepository,
  ) {}

  async execute(
    petId: number,
    userId: number,
    id: number,
    data: UpdateReminderInput,
  ) {
    const pet =
      await this.reminderRepository.findPetByIdAndUserId(
        petId,
        userId,
      );

    if (!pet) return null;

    return this.reminderRepository.updateByIdAndPetId(
      id,
      petId,
      data,
    );
  }
}
