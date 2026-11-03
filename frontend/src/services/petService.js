import api from './api';

export const petService = {
  getAll: async () => (await api.get('/pets')).data,
  getById: async (id) => (await api.get(`/pets/${id}`)).data,
  create: async (petData) => (await api.post('/pets', petData)).data,
  update: async (id, petData) => (await api.put(`/pets/${id}`, petData)).data,
  delete: async (id) => (await api.delete(`/pets/${id}`)).data,
};