
import { AppointmentRepository } from "../repositories/appointment.repository.js";

export class ListAppointmentsService {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
  ) {}

  async execute(petId: number, userId: number) {
    const pet =
      await this.appointmentRepository.findPetByIdAndUserId(
        petId,
        userId,
      );

    if (!pet) return null;

    return this.appointmentRepository.findByPetId(petId);
  }
}
