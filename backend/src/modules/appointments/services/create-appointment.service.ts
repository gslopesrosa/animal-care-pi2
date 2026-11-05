
import { AppointmentRepository } from "../repositories/appointment.repository.js";
import type { CreateAppointmentInput } from "../schemas/create-appointment.schema.js";

export class CreateAppointmentService {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
  ) {}

  async execute(
    petId: number,
    userId: number,
    data: CreateAppointmentInput,
  ) {
    const pet =
      await this.appointmentRepository.findPetByIdAndUserId(
        petId,
        userId,
      );

    if (!pet) return null;

    return this.appointmentRepository.create(petId, data);
  }
}
