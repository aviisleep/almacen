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

// Obtener productos paginados
export const getProducts = async (page = 1, limit = 10) => {
  const response = await fetch(`${BASE_URL}/products?page=${page}&limit=${limit}`);
  return handleResponse(response);
};

// Obtener un solo producto por ID
export const getProductById = async (productId) => {
  const response = await fetch(`${BASE_URL}/products/${productId}`);
  return handleResponse(response);
};

// Crear un nuevo producto
export const createProduct = async (productData) => {
  const response = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  return handleResponse(response);
};

// Actualizar un producto existente
export const updateProduct = async (productId, updatedData) => {
  const response = await fetch(`${BASE_URL}/products/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });
  return handleResponse(response);
};

// Devolver producto al inventario
export const returnProductToInventory = async (productId, returnData) => {
  const response = await fetch(`${BASE_URL}/products/return-to-inventory/${productId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(returnData),
  });
  return handleResponse(response);
};

// Eliminar un producto
export const deleteProduct = async (productId) => {
  const response = await fetch(`${BASE_URL}/products/${productId}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// Actualizar cantidad de un producto
export const updateProductQuantity = async (productId, cantidadData) => {
  const response = await fetch(`${BASE_URL}/products/${productId}/cantidad`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cantidadData),
  });
  return handleResponse(response);
};

// Obtener historial de movimientos de un producto
export const getProductHistory = async (productId) => {
  const response = await fetch(`${BASE_URL}/products/${productId}/history`);
  return handleResponse(response);
};