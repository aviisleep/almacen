import axios from 'axios';

// Configuración base de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Configuración automática de headers según el tipo de datos
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    
    // Agregar token de autenticación si existe
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Error con respuesta del servidor
      const errorData = {
        status: error.response.status,
        message: error.response.data?.message || 'Error en la solicitud',
        data: error.response.data,
      };
      console.error('API Error:', errorData);
      return Promise.reject(errorData);
    } else if (error.request) {
      // Error sin respuesta del servidor
      const errorData = {
        message: 'No se pudo conectar al servidor',
        isConnectionError: true,
      };
      console.error('Connection Error:', errorData);
      return Promise.reject(errorData);
    } else {
      // Error en configuración de la solicitud
      console.error('Request Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

export const getDashboardStats = async () => {
  const response = await axios.get('/api/dashboard-stats'); // Ajusta la ruta si es necesario
  return response.data;
};

export default api;