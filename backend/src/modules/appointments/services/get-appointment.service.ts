
import { AppointmentRepository } from "../repositories/appointment.repository.js";

export class GetAppointmentService {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
  ) {}

  async execute(petId: number, userId: number, id: number) {
    const pet =
      await this.appointmentRepository.findPetByIdAndUserId(
        petId,
        userId,
      );

    if (!pet) return null;

    return this.appointmentRepository.findByIdAndPetId(id, petId);
  }
}
