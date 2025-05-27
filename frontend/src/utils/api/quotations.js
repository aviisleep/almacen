import api from './api';

// Obtener todas las cotizaciones con paginación
export const getQuotations = async (params = {}) => {
  try {
    const { page = 1, limit = 10, search = '', filter = 'todos' } = params;
    const response = await api.get('/quotations', {
      params: { page, limit, search, filter }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error en getQuotations:', error);
    throw error;
  }
};

// Mantener compatibilidad con el nombre anterior
export const getAllQuotations = getQuotations;

// Obtener una cotización por ID
export const getQuotationById = async (id) => {
  try {
    const response = await api.get(`/quotations/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error en getQuotationById:', error);
    throw error;
  }
};

// Crear una nueva cotización
export const createQuotation = async (quotationData) => {
  try {
    const response = await api.post('/quotations', quotationData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Actualizar una cotización
export const updateQuotation = async (id, quotationData) => {
  try {
    const response = await api.put(`/quotations/${id}`, quotationData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Eliminar una cotización
export const deleteQuotation = async (id) => {
  try {
    const response = await api.delete(`/quotations/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Funciones adicionales
export const getProductSuggestions = async (query) => {
  try {
    const response = await api.get(`/quotations/product-suggestions/${query}`);
    return response.data;
  } catch (error) {
    console.error('Error en getProductSuggestions:', error);
    throw error;
  }
};

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/quotations/stats/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error en getDashboardStats:', error);
    throw error;
  }
};

// Buscar cotizaciones
export const searchQuotations = async (params) => {
  try {
    const response = await api.get('/quotations/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error en searchQuotations:', error);
    throw error;
  }
};

export const updateQuotationStatus = async (id, newStatus) => {
  try {
    const response = await api.patch(`/quotations/${id}/status`, { status: newStatus });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateQuotationProducts = async (updates) => {
  try {
    const response = await api.patch('/quotations/products', { updates });
    return response.data;
  } catch (error) {
    throw error;
  }
};