// src/utils/api.js
const BASE_URL = 'http://localhost:5000/api'; // URL base del backend

// Función genérica para manejar errores
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Ocurrió un error en la solicitud.');
  }
  return response.json();
};

// Obtener estadísticas del dashboard
export const getDashboardStats = async () => {
  const response = await fetch(`${BASE_URL}/dashboard-stats`);
  return handleResponse(response);
};