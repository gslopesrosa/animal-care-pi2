import api from './api';

export const reminderService = {
  getAll: async (petId) =>
    (await api.get(`/pets/${petId}/reminders`)).data,

  getById: async (petId, id) =>
    (await api.get(`/pets/${petId}/reminders/${id}`)).data,

  create: async (petId, reminderData) =>
    (await api.post(
      `/pets/${petId}/reminders`,
      reminderData
    )).data,

  update: async (petId, id, reminderData) =>
    (await api.put(
      `/pets/${petId}/reminders/${id}`,
      reminderData
    )).data,

  delete: async (petId, id) =>
    (await api.delete(
      `/pets/${petId}/reminders/${id}`
    )).data,
};