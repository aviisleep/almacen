// src/utils/productsApi.js
import api from './api';


export const getProducts = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/products', { params: { page, limit } });
    
    // Verifica varias posibles estructuras de respuesta
    const data = response.data;
    
    if (data && Array.isArray(data.data)) {
      return {
        products: data.data,
        total: data.pagination?.total || data.data.length
      };
    }
    
    // Si la estructura es diferente
    return {
      products: Array.isArray(data) ? data : [],
      total: data?.total || data?.length || 0
    };
    
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], total: 0 };
  }
}

export const getById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  }

export const createProduct = async (data) => {
    const response = await api.post('/products', data);
    return response.data;
  }

  export const update = async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  }
  
// Eliminar un producto por ID
export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al eliminar el producto");
  }
};

  export const returnToInventory = async (id, returnData) => {
    const response = await api.post(`/products/return-to-inventory/${id}`, returnData);
    return response.data;
  }

  export const updatecantidad = async (id, quantityData) => {
    const response = await api.put(`/products/${id}/cantidad`, quantityData);
    return response.data;
  }

  export const getHistory = async (id) => {
    const response = await api.get(`/products/${id}/history`);
    return response.data;
  }

