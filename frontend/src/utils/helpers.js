import { toast } from 'react-toastify';
import axios from 'axios';

// Configuración de axios
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

// Helper para preparar FormData
export const prepareFormData = (formData) => {
  const dataToSend = new FormData();
  
  // Campos simples
  const simpleFields = ['compania', 'observaciones'];
  simpleFields.forEach(field => {
    if (formData[field] !== undefined) {
      dataToSend.append(field, formData[field]);
    }
  });
  
  // Campos anidados
  const nestedFields = ['conductor', 'vehiculo', 'reparacionesSolicitadas'];
  nestedFields.forEach(field => {
    if (formData[field]) {
      dataToSend.append(field, JSON.stringify(formData[field]));
    }
  });
  
  // Archivos
  if (formData.fotosEntrada?.length > 0) {
    formData.fotosEntrada.forEach(file => {
      dataToSend.append('fotos', file);
    });
  }
  
  if (formData.firmas?.encargado) {
    dataToSend.append('firmaEncargado', formData.firmas.encargado);
  }
  
  if (formData.firmas?.conductor) {
    dataToSend.append('firmaConductor', formData.firmas.conductor);
  }
  
  return dataToSend;
};

// Helper para manejar errores
export const handleApiError = (error, defaultMessage) => {
  const errorMessage = error.response?.data?.message || error.message || defaultMessage;
  toast.error(errorMessage);
  console.error('Error detallado:', error.response?.data || error.message);
  return error;
};

// Notificaciones
export const notify = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  info: (message) => toast.info(message),
  warning: (message) => toast.warning(message)
};