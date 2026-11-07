
import api from './api';

export const petPhotoService = {
  upload: async (photo) => {
    const formData = new FormData();
    formData.append('photo', photo);

    const response = await api.post('/pet-photos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};
