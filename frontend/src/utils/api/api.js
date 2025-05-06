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

// Obtener conteo de productos
export const getProductCount = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products/count`);
    const data = await handleResponse(response);
    return data.total; // Asegúrate que tu backend devuelve {total: number}
  } catch (error) {
    console.error("Error fetching product count:", error);
    return 0; // Valor por defecto en caso de error
  }
};