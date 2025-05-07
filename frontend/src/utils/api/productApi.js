// src/utils/productsApi.js
import { api } from './api';


export const getProducts = async (page = 1, limit = 10) => {
    const response = await api.get('/products', { params: { page, limit } });
    return response.data;
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

  export const deleteProduct = async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }

  export const returnToInventory = async (id, returnData) => {
    const response = await api.post(`/products/return-to-inventory/${id}`, returnData);
    return response.data;
  }

  export const updateQuantity = async (id, quantityData) => {
    const response = await api.put(`/products/${id}/cantidad`, quantityData);
    return response.data;
  }

  export const getHistory = async (id) => {
    const response = await api.get(`/products/${id}/history`);
    return response.data;
  }

