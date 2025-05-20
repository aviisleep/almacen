// src/utils/salidasApi.js
import api from './api';

export const salidasApi = {
  getAll: async () => {
    const response = await api.get('/salidas');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/salidas/${id}`);
    return response.data;
  },

  getByIngresoId: async (ingresoId) => {
    const response = await api.get(`/salidas/ingreso/${ingresoId}`);
    return response.data;
  },

  create: async (formData) => {
    try {
      const dataToSend = new FormData();

      // Validaciones básicas
      if (!formData.ingreso) {
        throw new Error('El campo ingreso es requerido');
      }

      dataToSend.append('ingreso', formData.ingreso);
      if (formData.comentarios) {
        dataToSend.append('comentarios', formData.comentarios);
      }

      // Subir fotos de salida
      if (formData.fotosSalida?.length > 0) {
        formData.fotosSalida.forEach(file => {
          if (file instanceof File || file instanceof Blob) {
            dataToSend.append('fotosSalida', file);
          }
        });
      }

      // Subir firma del receptor
      if (formData.firmaRecibido) {
        dataToSend.append('firmaRecibido', formData.firmaRecibido);
      }

      const response = await api.post('/salidas', dataToSend);
      return response.data;
    } catch (error) {
      console.error('Error al crear salida:', {
        message: error.message,
        formData: {
          ...formData,
          fotosSalida: `Array(${formData.fotosSalida?.length || 0})`,
          firmaRecibido: '[Object]'
        }
      });
      throw error;
    }
  },

  update: async (id, data) => {
    const response = await api.put(`/salidas/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/salidas/${id}`);
    return response.data;
  }
};
