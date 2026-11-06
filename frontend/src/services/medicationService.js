import api from './api';

export const medicationService = {
  getAll: async (petId) =>
    (await api.get(`/pets/${petId}/medications`)).data,

  getById: async (petId, id) =>
    (await api.get(`/pets/${petId}/medications/${id}`)).data,

  create: async (petId, medicationData) =>
    (await api.post(
      `/pets/${petId}/medications`,
      medicationData
    )).data,

  update: async (petId, id, medicationData) =>
    (await api.put(
      `/pets/${petId}/medications/${id}`,
      medicationData
    )).data,

  delete: async (petId, id) =>
    (await api.delete(
      `/pets/${petId}/medications/${id}`
    )).data,
};