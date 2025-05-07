import { api } from './api';

export const ingresosApi = {
  getAll: async (params = {}) => {
    const response = await api.get('/ingresos', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/ingresos/${id}`);
    return response.data;
  },
  create: async (data) => {
    const formData = new FormData();
    
    // Append all fields to formData
    Object.keys(data).forEach(key => {
      if (key === 'fotosEntrada' || key === 'firmas') return;
      
      if (typeof data[key] === 'object' && data[key] !== null) {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });
    
    // Append photos
    data.fotosEntrada.forEach((file) => {
      formData.append('fotos', file);
    });
    
    // Append signatures
    formData.append('firmaEncargado', data.firmas.encargado);
    formData.append('firmaConductor', data.firmas.conductor);
    
    const response = await api.post('/ingresos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/ingresos/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/ingresos/${id}`);
    return response.data;
  }
};