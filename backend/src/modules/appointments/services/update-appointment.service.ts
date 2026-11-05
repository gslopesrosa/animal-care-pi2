
import { AppointmentRepository } from "../repositories/appointment.repository.js";
import type { UpdateAppointmentInput } from "../schemas/update-appointment.schema.js";

export class UpdateAppointmentService {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
  ) {}

  async execute(
    petId: number,
    userId: number,
    id: number,
    data: UpdateAppointmentInput,
  ) {
    const pet =
      await this.appointmentRepository.findPetByIdAndUserId(
        petId,
        userId,
      );

    if (!pet) return null;

    return this.appointmentRepository.updateByIdAndPetId(
      id,
      petId,
      data,
    );
  }
}
