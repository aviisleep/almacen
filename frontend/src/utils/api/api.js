// src/utils/api.js
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para manejar errores de forma global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API error:', error.response.status, error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      console.error('No se recibió respuesta:', error.request);
      return Promise.reject({ message: 'No se pudo conectar al servidor' });
    } else {
      console.error('Error al configurar la solicitud:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard-stats');
  return response.data;
};
