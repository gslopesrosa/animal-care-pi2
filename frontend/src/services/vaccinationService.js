
import api from './api';

export const vaccinationService = {
  getAll: async (petId) =>
    (await api.get(`/pets/${petId}/vaccinations`)).data,

  getById: async (petId, id) =>
    (await api.get(`/pets/${petId}/vaccinations/${id}`)).data,

  create: async (petId, vaccinationData) =>
    (await api.post(`/pets/${petId}/vaccinations`, vaccinationData)).data,

  update: async (petId, id, vaccinationData) =>
    (await api.put(
      `/pets/${petId}/vaccinations/${id}`,
      vaccinationData
    )).data,

  delete: async (petId, id) =>
    (await api.delete(`/pets/${petId}/vaccinations/${id}`)).data,
};
