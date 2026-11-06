
import api from './api';

export const appointmentService = {
  getAll: async (petId) =>
    (await api.get(`/pets/${petId}/appointments`)).data,

  getById: async (petId, id) =>
    (await api.get(`/pets/${petId}/appointments/${id}`)).data,

  create: async (petId, appointmentData) =>
    (await api.post(
      `/pets/${petId}/appointments`,
      appointmentData
    )).data,

  update: async (petId, id, appointmentData) =>
    (await api.put(
      `/pets/${petId}/appointments/${id}`,
      appointmentData
    )).data,

  delete: async (petId, id) =>
    (await api.delete(
      `/pets/${petId}/appointments/${id}`
    )).data,
};
