
import { AppointmentRepository } from "../repositories/appointment.repository.js";

export class DeleteAppointmentService {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
  ) {}

  async execute(petId: number, userId: number, id: number) {
    const pet =
      await this.appointmentRepository.findPetByIdAndUserId(
        petId,
        userId,
      );

    if (!pet) return false;

    return this.appointmentRepository.deleteByIdAndPetId(
      id,
      petId,
    );
  }
}
